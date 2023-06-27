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
exports.TelegramClient = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const TokenInjectionToken_1 = require("./TokenInjectionToken");
const Telegram = require('telegraf/telegram');
let TelegramClient = (() => {
    let TelegramClient = class TelegramClient {
        constructor(factory) {
            const { token } = factory.createOptions();
            this.telegram = new Telegram(token);
        }
        sendMessage(chatId, text, options) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.telegram.sendMessage(chatId, text, options);
            });
        }
        getChatMember(chatId, userId) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.telegram.getChatMember(chatId, userId);
            });
        }
        sendMarkdown(chatId, markdown, options) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.telegram.sendMessage(chatId, markdown, lodash_1.merge({
                    parse_mode: 'Markdown',
                }, options));
            });
        }
        getChat(chatId) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.telegram.getChat(chatId);
            });
        }
    };
    TelegramClient = __decorate([
        common_1.Injectable(),
        __param(0, common_1.Inject(TokenInjectionToken_1.TokenInjectionToken)),
        __metadata("design:paramtypes", [Object])
    ], TelegramClient);
    return TelegramClient;
})();
exports.TelegramClient = TelegramClient;
//# sourceMappingURL=TelegramClient.js.map