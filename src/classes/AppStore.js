class WaveAppStore {
    constructor(storeObject = { data: {}, methods: {} }) {
        this.data = storeObject.data;
        this.methods = storeObject.methods;
    };
};

export default WaveAppStore;