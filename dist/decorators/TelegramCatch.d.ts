import { Type } from '@nestjs/common';
import { TelegramErrorHandler } from '../interfaces/TelegramErrorHandler';
declare type Decorator = (error: any) => ClassDecorator;
declare type HandlerDecorator = Decorator & {
    handlers?: Map<Error, Type<TelegramErrorHandler>>;
};
export declare const TelegramCatch: HandlerDecorator;
export {};
