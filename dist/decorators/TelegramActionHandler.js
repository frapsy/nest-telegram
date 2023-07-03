"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addHandlerToStore = exports.TelegramActionHandler = void 0;
exports.TelegramActionHandler = (parameters) => (target, propertyKey) => {
    exports.addHandlerToStore(target, propertyKey, parameters);
};
exports.addHandlerToStore = (instance, name, config) => {
    const handlerClass = instance.constructor;
    if (!exports.TelegramActionHandler.handlers) {
        exports.TelegramActionHandler.handlers = new Map();
    }
    if (!exports.TelegramActionHandler.handlers.get(handlerClass)) {
        exports.TelegramActionHandler.handlers.set(handlerClass, new Map());
    }
    const oldParameters = exports.TelegramActionHandler.handlers.get(handlerClass).get(name) || {};
    exports.TelegramActionHandler.handlers.get(handlerClass).set(name, Object.assign(Object.assign(Object.assign({}, oldParameters), config), { transformations: [
            ...(oldParameters.transformations || []),
            ...(config.transformations || []),
        ] }));
};
//# sourceMappingURL=TelegramActionHandler.js.map