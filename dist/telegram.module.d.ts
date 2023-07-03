import { MiddlewareConsumer, NestModule, DynamicModule } from '@nestjs/common';
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { TelegramModuleOptionsFactory } from './TelegramModuleOptionsFactory';
interface TelegramFactory extends Pick<ModuleMetadata, 'imports'> {
    useClass?: Type<TelegramModuleOptionsFactory>;
}
export declare class TelegramModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void;
    static forRootAsync(factory: TelegramFactory): DynamicModule;
}
export {};
