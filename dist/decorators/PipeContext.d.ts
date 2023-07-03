import { Type } from '@nestjs/common';
import { ContextTransformer } from '../ContextTransformer';
export declare const PipeContext: <T>(transform: Type<ContextTransformer<T>>) => (target: Object, propertyKey: string, parameterIndex: number) => void;
