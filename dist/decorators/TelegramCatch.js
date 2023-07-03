"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramCatch = void 0;
exports.TelegramCatch = (error) => (target) => {
    if (!exports.TelegramCatch.handlers) {
        exports.TelegramCatch.handlers = new Map();
    }
    exports.TelegramCatch.handlers.set(error, target);
    return target;
};
//# sourceMappingURL=TelegramCatch.js.map