export interface WaveDictionary<T> {
    [key: string]: T;
}

export interface WaveStoreGetResult {
    initialValue: any;
    getValue: () => any;
    update: (value: any) => Promise<WaveStoreGetResult>; 
}

export type WaveProxyHandler = (newValue: any) => Promise<boolean> | boolean;
export type WaveLogicalOperatorHandler = (data: any, compareWith: any) => boolean;
export type WaveComponentHandler = (...args: any[]) => Promise<Element> | Element;

export enum WaveStatementType {
    Data,
    Component
}

export interface WaveStatement {
    type: WaveStatementType;
    name: string; params:
    string[];
    match: string;
}