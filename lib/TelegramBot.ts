import { Injectable, Inject } from '@nestjs/common';
import { UpdateType, MessageSubTypes } from 'telegraf/typings/telegram-types';
import Telegraf, { Context } from 'telegraf';
import { flatten, head } from 'lodash';

import { ContextTransformer } from './ContextTransformer';
import { TelegramCatch } from './decorators/TelegramCatch';
import { TelegramErrorHandler } from './interfaces/TelegramErrorHandler';
import { ServiceProvider } from './interfaces/ServiceProvider';
import { Handler } from './Handler';
import { Bot } from './Bot';
import { TelegramActionHandler } from './decorators/TelegramActionHandler';
import { TokenInjectionToken } from './TokenInjectionToken';
import { TelegramModuleOptionsFactory } from './TelegramModuleOptionsFactory';
import { InvalidConfigurationException } from './InvalidConfigurationException';

@Injectable()
export class TelegramBot {
  private readonly sitePublicUrl?: string;

  private readonly usePolling: boolean;

  private ref: ServiceProvider;

  readonly telegrafBot: Bot;

  constructor(
    @Inject(TokenInjectionToken) factory: TelegramModuleOptionsFactory,
  ) {
    const { token, sitePublicUrl, usePolling } = factory.createOptions();

    this.sitePublicUrl = sitePublicUrl;
    this.usePolling = Boolean(usePolling);
    this.telegrafBot = new Telegraf(token);
  }

  init(ref: ServiceProvider) {
    this.ref = ref;

    const handlers = this.createHandlers();

    this.setupOnStart(handlers);
    this.setupOnMessage(handlers);
    this.setupOnCommand(handlers);
    this.setupOnAnyUpdateType(handlers);
    this.setupOnAction(handlers);

    if (this.usePolling) {
      this.startPolling();
    }
  }

  getMiddleware(path: string) {
    if (!this.sitePublicUrl) {
      throw new InvalidConfigurationException(
        'sitePublicUrl',
        'does not exist, but webook used',
      );
    }

    if (this.usePolling) {
      throw new InvalidConfigurationException(
        'usePolling',
        'passed, but middleware required',
      );
    }

    const url = `${this.sitePublicUrl}/${path}`;

    this.telegrafBot.telegram
      .setWebhook(url)
      .then(() => console.log(`Webhook set success @ ${url}`));

    return this.telegrafBot.webhookCallback(`/${path}`);
  }

  private startPolling() {
    this.telegrafBot.telegram.deleteWebhook().then(
      () => this.telegrafBot.startPolling(),
      () => {
        // okay, never mind
      },
    );
  }

  private createHandlers(): Handler[] {
    return flatten(
      Array.from((TelegramActionHandler.handlers || new Map()).entries()).map(
        ([handlerClass, classConfig]) => {
          const handlerInstance = this.ref.get(handlerClass, { strict: false });

          return Array.from(classConfig.entries()).map(
            ([methodName, methodCondig]) => ({
              handle: handlerInstance[methodName].bind(handlerInstance),
              config: methodCondig,
            }),
          );
        },
      ),
    );
  }

  private setupOnStart(handlers: Handler[]): void {
    const onStart = handlers.filter(({ config }) => config.onStart);

    if (onStart.length !== 1) {
      throw new Error('nest-telegram requires exactly one onStart handler');
    }

    this.telegrafBot.start(this.adoptHandle(head(onStart)));
  }

  private setupOnMessage(handlers: Handler[]): void {
    const onMessageHandlers = handlers.filter(({ config }) => config.message);

    onMessageHandlers.forEach((handler) => {
      this.telegrafBot.hears(handler.config.message, this.adoptHandle(handler));
    });
  }

  private setupOnCommand(handlers: Handler[]): void {
    const commandHandlers = handlers.filter(({ config }) => config.command);

    commandHandlers.forEach((handler) => {
      this.telegrafBot.command(
        handler.config.command,
        this.adoptHandle(handler),
      );
    });
  }

  private setupOnAction(handlers: Handler[]): void {
    const commandHandlers = handlers.filter(({ config }) => config.action);

    commandHandlers.forEach((handler) => {
      this.telegrafBot.action(handler.config.action, this.adoptHandle(handler));
    });
  }

  private setupOnAnyUpdateType(handlers: Handler[]): void {
    handlers
      .filter((handler) => handler.config.on)
      .forEach((handler) => {
        this.telegrafBot.on(handler.config.on, this.adoptHandle(handler));
      });
  }

  private adoptHandle({ handle, config }: Handler) {
    const errorHandler = this.createCatch();

    return async (ctx: Context) => {
      const args = await Promise.all(
        (config.transformations || [])
          .sort((a, b) => a.index - b.index)
          .map(({ transform }) =>
            this.ref
              .get<ContextTransformer>(transform, { strict: false })
              .transform(ctx),
          ),
      );

      return handle(ctx, ...args).catch(errorHandler(ctx));
    };
  }

  private createCatch() {
    const handlers = Array.from(
      (TelegramCatch.handlers || new Map()).entries(),
    ).map(([errorType, handlerType]) => {
      const handler = this.ref.get<TelegramErrorHandler>(handlerType, {
        strict: false,
      });

      return {
        errorType,
        handler,
      };
    });

    return (ctx: Context) => (e: any) => {
      for (const { errorType, handler } of handlers) {
        if (e instanceof (errorType as any)) {
          return handler.catch(ctx, e);
        }
      }

      throw e;
    };
  }
}
