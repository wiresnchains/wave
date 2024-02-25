class WaveDataListener {
    /**
     * Listens for variable changes and calls back when it has changed
     * @param {WaveStore} store
     * @param {string} key
     * @param {number} refrestRate
     * @param {VoidFunction} callback
     */
    constructor(store, key, refrestRate, callback) {
        this.store = store;
        this.key = key;
        this.refrestRate = refrestRate;
        this.callback = callback;

        this.previousValue = store.data[key];

        this.listen();
    };

    listen() {
        this.interval = setInterval(async () => {
            const newValue = this.store.data[this.key];
    
            if (this.previousValue === newValue)
                return;

            const proxy = this.store.proxies[this.key];

            if (proxy) {
                this.store.data[this.key] = this.previousValue;

                const result = await proxy(newValue);

                if (result) {
                    this.store.data[this.key] = newValue;
                    this.callback();
                    this.previousValue = newValue;
                }

                return;
            }
            
            this.callback();
            this.previousValue = newValue;
        }, this.refrestRate);
    };

    stop() {
        clearInterval(this.interval);
    };
};

export default WaveDataListener;