declare interface WaveDictionary<T> {
    [key: string]: T;
}

declare type WaveDataType = string | number | boolean;
declare type WaveProxyHandler = (newValue: any) => Promise<boolean>;
declare type WaveLogicalOperatorHandler = (data: any, compareWith: any) => boolean;