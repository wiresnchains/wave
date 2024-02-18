class WaveDataListener {
    /**
     * Listens for variable changes and calls back when it has changed
     * @param {object} object
     * @param {string} key
     * @param {number} refrestRate
     * @param {VoidFunction} callback
     */
    constructor(object, key, refrestRate, callback) {
        this.object = object;
        this.key = key;
        this.refrestRate = refrestRate;
        this.callback = callback;

        this.previousValue = object[key];

        this.listen();
    };

    listen() {
        this.interval = setInterval(() => {
            const currentValue = this.object[this.key];
    
            if (this.previousValue === currentValue)
                return;
    
            this.callback();
    
            this.previousValue = currentValue;
        }, this.refrestRate);
    };

    stop() {
        clearInterval(this.interval);
    };
};

export default WaveDataListener;