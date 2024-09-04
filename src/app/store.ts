export class WaveStore {
    public onDataChange?: (instance: WaveStore, changedKey: string) => void;

    private data: WaveDictionary<WaveDataType>;
    private proxies: WaveDictionary<WaveProxyHandler>;

    constructor(from: { data?: WaveDictionary<WaveDataType>, proxies?: WaveDictionary<WaveProxyHandler> } = {}) {
        this.data = from.data || {};
        this.proxies = from.proxies || {};
    }

    public async setValue(key: string, value: WaveDataType) {
        const proxy = this.proxies[key];

        if (proxy) {
            const proxyResult = await proxy(value);

            if (!proxyResult)
                return;
        }

        this.data[key] = value;
        
        if (this.onDataChange)
            this.onDataChange(this, key);
    }

    public getValue(key: string) {
        return this.data[key];
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
}