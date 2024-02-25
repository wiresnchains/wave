class WaveStore {
    /**
     * Creates a store for the WaveApp
     * @param {JSON} storeObject
     */
    constructor(storeObject = { data: {}, methods: {}, proxies: {} }) {
        this.data = storeObject.data || {};
        this.methods = storeObject.methods || {};
        this.proxies = storeObject.proxies || {};
        this.dataListeners = [];
    };
};

export default WaveStore;