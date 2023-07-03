/// <reference types="node" />
import { ServiceProvider } from './interfaces/ServiceProvider';
import { Bot } from './Bot';
import { TelegramModuleOptionsFactory } from './TelegramModuleOptionsFactory';
export declare class TelegramBot {
    private readonly sitePublicUrl?;
    private readonly usePolling;
    private ref;
    readonly telegrafBot: Bot;
    constructor(factory: TelegramModuleOptionsFactory);
    init(ref: ServiceProvider): void;
    getMiddleware(path: string): (req: import("http").IncomingMessage, res: import("http").ServerResponse) => void;
    private startPolling;
    private createHandlers;
    private setupOnStart;
    private setupOnMessage;
    private setupOnCommand;
    private setupOnAction;
    private setupOnAnyUpdateType;
    private adoptHandle;
    private createCatch;
}
