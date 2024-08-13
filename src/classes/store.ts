interface WaveStoreOptions {
    // TODO: Remove "any"-types
    data?: any;
    proxies?: any;
}

class WaveStore {
    // TODO: Remove "any"-types
    public data: any;
    public proxies: any;
    public dataListeners: any;

    constructor(options: WaveStoreOptions = { data: {}, proxies: {} }) {
        this.data = options.data || {};
        this.proxies = options.proxies || {};
        this.dataListeners = {};
    }

    public isEmpty(): boolean {
        return Object.keys(this.data).length === 0 && Object.keys(this.proxies).length === 0;
    }
}

export { WaveStore };