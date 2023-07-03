"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramBot = void 0;
const common_1 = require("@nestjs/common");
const telegraf_1 = require("telegraf");
const lodash_1 = require("lodash");
const TelegramCatch_1 = require("./decorators/TelegramCatch");
const TelegramActionHandler_1 = require("./decorators/TelegramActionHandler");
const TokenInjectionToken_1 = require("./TokenInjectionToken");
const InvalidConfigurationException_1 = require("./InvalidConfigurationException");
let TelegramBot = (() => {
    let TelegramBot = class TelegramBot {
        constructor(factory) {
            const { token, sitePublicUrl, usePolling } = factory.createOptions();
            this.sitePublicUrl = sitePublicUrl;
            this.usePolling = Boolean(usePolling);
            this.telegrafBot = new telegraf_1.default(token);
        }
        init(ref) {
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
        getMiddleware(path) {
            if (!this.sitePublicUrl) {
                throw new InvalidConfigurationException_1.InvalidConfigurationException('sitePublicUrl', 'does not exist, but webook used');
            }
            if (this.usePolling) {
                throw new InvalidConfigurationException_1.InvalidConfigurationException('usePolling', 'passed, but middleware required');
            }
            const url = `${this.sitePublicUrl}/${path}`;
            this.telegrafBot.telegram
                .setWebhook(url)
                .then(() => console.log(`Webhook set success @ ${url}`));
            return this.telegrafBot.webhookCallback(`/${path}`);
        }
        startPolling() {
            this.telegrafBot.telegram.deleteWebhook().then(() => this.telegrafBot.startPolling(), () => {
            });
        }
        createHandlers() {
            return lodash_1.flatten(Array.from((TelegramActionHandler_1.TelegramActionHandler.handlers || new Map()).entries()).map(([handlerClass, classConfig]) => {
                const handlerInstance = this.ref.get(handlerClass, { strict: false });
                return Array.from(classConfig.entries()).map(([methodName, methodCondig]) => ({
                    handle: handlerInstance[methodName].bind(handlerInstance),
                    config: methodCondig,
                }));
            }));
        }
        setupOnStart(handlers) {
            const onStart = handlers.filter(({ config }) => config.onStart);
            if (onStart.length !== 1) {
                throw new Error('nest-telegram requires exactly one onStart handler');
            }
            this.telegrafBot.start(this.adoptHandle(lodash_1.head(onStart)));
        }
        setupOnMessage(handlers) {
            const onMessageHandlers = handlers.filter(({ config }) => config.message);
            onMessageHandlers.forEach((handler) => {
                this.telegrafBot.hears(handler.config.message, this.adoptHandle(handler));
            });
        }
        setupOnCommand(handlers) {
            const commandHandlers = handlers.filter(({ config }) => config.command);
            commandHandlers.forEach((handler) => {
                this.telegrafBot.command(handler.config.command, this.adoptHandle(handler));
            });
        }
        setupOnAction(handlers) {
            const commandHandlers = handlers.filter(({ config }) => config.action);
            commandHandlers.forEach((handler) => {
                this.telegrafBot.action(handler.config.action, this.adoptHandle(handler));
            });
        }
        setupOnAnyUpdateType(handlers) {
            handlers
                .filter((handler) => handler.config.on)
                .forEach((handler) => {
                this.telegrafBot.on(handler.config.on, this.adoptHandle(handler));
            });
        }
        adoptHandle({ handle, config }) {
            const errorHandler = this.createCatch();
            return (ctx) => __awaiter(this, void 0, void 0, function* () {
                const args = yield Promise.all((config.transformations || [])
                    .sort((a, b) => a.index - b.index)
                    .map(({ transform }) => this.ref
                    .get(transform, { strict: false })
                    .transform(ctx)));
                return handle(ctx, ...args).catch(errorHandler(ctx));
            });
        }
        createCatch() {
            const handlers = Array.from((TelegramCatch_1.TelegramCatch.handlers || new Map()).entries()).map(([errorType, handlerType]) => {
                const handler = this.ref.get(handlerType, {
                    strict: false,
                });
                return {
                    errorType,
                    handler,
                };
            });
            return (ctx) => (e) => {
                for (const { errorType, handler } of handlers) {
                    if (e instanceof errorType) {
                        return handler.catch(ctx, e);
                    }
                }
                throw e;
            };
        }
    };
    TelegramBot = __decorate([
        common_1.Injectable(),
        __param(0, common_1.Inject(TokenInjectionToken_1.TokenInjectionToken)),
        __metadata("design:paramtypes", [Object])
    ], TelegramBot);
    return TelegramBot;
})();
exports.TelegramBot = TelegramBot;
//# sourceMappingURL=TelegramBot.js.map