class WaveStore {
    /**
     * Creates a store for the WaveApp
     * @param {JSON} storeObject
     */
    constructor(storeObject = { data: {}, methods: {} }) {
        this.data = storeObject.data;
        this.methods = storeObject.methods;
        this.dataListeners = [];
    };
};

export default WaveStore;