import { WaveDataType, WaveDictionary, WaveProxyHandler, WaveStoreGetResult } from "../@types/index";

type WaveDataChangeCallback = (instance: WaveStore, changedKey: string) => void;

export class WaveStore {
    public dataChangeCallbacks: WaveDataChangeCallback[];

    private data: WaveDictionary<WaveDataType>;
    private proxies: WaveDictionary<WaveProxyHandler>;

    constructor(from: { data?: WaveDictionary<WaveDataType>, proxies?: WaveDictionary<WaveProxyHandler> } = {}) {
        this.data = from.data || {};
        this.proxies = from.proxies || {};
        this.dataChangeCallbacks = [];
    }

    public async setValue(key: string, value: WaveDataType) {
        const proxy = this.proxies[key];

        if (proxy) {
            const proxyResult = await proxy(value);

            if (!proxyResult)
                return;
        }

        this.data[key] = value;

        for (let i = 0; i < this.dataChangeCallbacks.length; i++)
            this.dataChangeCallbacks[i](this, key);
    }

    public getValue(key: string) {
        return this.data[key];
    }

    public get(key: string): WaveStoreGetResult | undefined {
        const value = this.getValue(key);

        if (value == undefined)
            return;

        return { initialValue: value, getValue: () => this.getValue(key), update: async (_value: WaveDataType) => { return await this.set(key, _value) as WaveStoreGetResult } };
    }

    public async set(key: string, value: WaveDataType) {
        await this.setValue(key, value);
        return this.get(key);
    }

    public setProxy(key: string, handler: WaveProxyHandler) {
        this.proxies[key] = handler;
    }

    public removeProxy(key: string) {
        delete this.proxies[key];
    }

    public getDataKeys() {
        return Object.keys(this.data);
    }

    public addDataChangeCallback(callback: WaveDataChangeCallback) {
        this.dataChangeCallbacks.push(callback);
    }
}