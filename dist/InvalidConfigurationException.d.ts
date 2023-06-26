export declare class InvalidConfigurationException extends Error {
    readonly invalidField: any;
    readonly invalidCause: any;
    constructor(invalidField: any, invalidCause: any);
}
