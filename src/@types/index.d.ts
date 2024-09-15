export interface WaveDictionary<T> {
    [key: string]: T;
}

export interface WaveStoreGetResult {
    initialValue: WaveDataType;
    getValue: () => WaveDataType;
    update: (value: WaveDataType) => Promise<WaveStoreGetResult>; 
}

export type WaveDataType = string | number | boolean;
export type WaveProxyHandler = (newValue: any) => Promise<boolean>;
export type WaveLogicalOperatorHandler = (data: any, compareWith: any) => boolean;