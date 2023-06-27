import { Chat } from 'telegraf/typings/telegram-types';
import { TelegramModuleOptionsFactory } from './TelegramModuleOptionsFactory';
export declare class TelegramClient {
    private telegram;
    constructor(factory: TelegramModuleOptionsFactory);
    sendMessage(chatId: string | number, text: string, options?: object): Promise<void>;
    getChatMember(chatId: any, userId: any): Promise<any>;
    sendMarkdown(chatId: string | number, markdown: string, options?: object): Promise<void>;
    getChat(chatId: string | number): Promise<Chat>;
}
