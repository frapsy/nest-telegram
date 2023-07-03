import { HandleParameters } from '../HandleParameters';
declare type Decorator = (params: HandleParameters) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
declare type HandlerDecorator = Decorator & {
    handlers?: Map<any, Map<string, HandleParameters>>;
};
export declare const TelegramActionHandler: HandlerDecorator;
export declare const addHandlerToStore: (instance: Object, name: string, config: HandleParameters) => void;
export {};
