class WaveDataListener {
    constructor(object, key, callbackObject, refrestRate) {
        if (!callbackObject.dataChanged) {
            console.error("[WaveDataListener] `callbackObject` has no `dataChanged()` method.");
            return;
        }

        this.object = object;
        this.key = key;
        this.callbackObject = callbackObject;
        this.refrestRate = refrestRate;

        this.previousValue = object[key];

        this.listen();
    };

    listen() {
        setInterval(() => {
            const currentValue = this.object[this.key];
    
            if (this.previousValue === currentValue)
                return;
    
            this.callbackObject.dataChanged();
    
            this.previousValue = currentValue;
        }, this.refrestRate);
    };
};

export default WaveDataListener;