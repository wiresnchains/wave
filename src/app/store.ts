import { WaveComponentHandler, WaveDictionary, WaveProxyHandler, WaveStoreGetResult } from "../@types/index";

type WaveDataChangeCallback = (instance: WaveStore, changedKey: string) => void;

export class WaveStore {
    public dataChangeCallbacks: WaveDataChangeCallback[];

    private data: WaveDictionary<any>;
    private proxies: WaveDictionary<WaveProxyHandler>;
    private components: WaveDictionary<WaveComponentHandler>;

    constructor(from: { data?: WaveDictionary<any>, proxies?: WaveDictionary<WaveProxyHandler>, components?: WaveDictionary<WaveComponentHandler> } = {}) {
        this.data = from.data || {};
        this.proxies = from.proxies || {};
        this.components = from.components || {};
        this.dataChangeCallbacks = [];
    }

    public async setValue(key: string, value: any) {
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

        return { initialValue: value, getValue: () => this.getValue(key), update: async (_value: any) => { return await this.set(key, _value) as WaveStoreGetResult } };
    }

    public async set(key: string, value: any) {
        await this.setValue(key, value);
        return this.get(key);
    }

    public setProxy(key: string, handler: WaveProxyHandler) {
        this.proxies[key] = handler;
    }

    public removeProxy(key: string) {
        delete this.proxies[key];
    }

    public getComponentHandler(key: string) {
        return this.components[key];
    }

    public setComponentHandler(key: string, handler: WaveComponentHandler) {
        this.components[key] = handler;
    }

    public getDataKeys() {
        return Object.keys(this.data);
    }

    public getComponentKeys() {
        return Object.keys(this.components);
    }

    public addDataChangeCallback(callback: WaveDataChangeCallback) {
        this.dataChangeCallbacks.push(callback);
    }
}