"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramModule = void 0;
const common_1 = require("@nestjs/common");
const TelegramBot_1 = require("./TelegramBot");
const TokenInjectionToken_1 = require("./TokenInjectionToken");
const TelegramClient_1 = require("./TelegramClient");
let TelegramModule = (() => {
    var TelegramModule_1;
    let TelegramModule = TelegramModule_1 = class TelegramModule {
        configure(consumer) {
        }
        static forRootAsync(factory) {
            return {
                imports: factory.imports,
                module: TelegramModule_1,
                providers: [
                    TelegramBot_1.TelegramBot,
                    TelegramClient_1.TelegramClient,
                    {
                        provide: TokenInjectionToken_1.TokenInjectionToken,
                        useClass: factory.useClass,
                    },
                ],
                exports: [TelegramBot_1.TelegramBot, TelegramClient_1.TelegramClient],
            };
        }
    };
    TelegramModule = TelegramModule_1 = __decorate([
        common_1.Module({})
    ], TelegramModule);
    return TelegramModule;
})();
exports.TelegramModule = TelegramModule;
//# sourceMappingURL=telegram.module.js.map