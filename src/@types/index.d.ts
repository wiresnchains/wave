export interface WaveDictionary<T> {
    [key: string]: T;
}

export type WaveDataType = string | number | boolean;
export type WaveProxyHandler = (newValue: any) => Promise<boolean>;

export type WaveLogicalOperatorHandler = (data: any, compareWith: any) => boolean;