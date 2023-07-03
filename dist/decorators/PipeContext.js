"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipeContext = void 0;
const TelegramActionHandler_1 = require("./TelegramActionHandler");
exports.PipeContext = (transform) => (target, propertyKey, parameterIndex) => {
    TelegramActionHandler_1.addHandlerToStore(target, propertyKey, {
        transformations: [
            {
                index: parameterIndex,
                transform,
            },
        ],
    });
};
//# sourceMappingURL=PipeContext.js.map