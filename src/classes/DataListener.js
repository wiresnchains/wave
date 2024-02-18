/**
 * @name DataChangeCallback
 * @function
 * @param {VoidFunction} dataChanged
 */

class WaveDataListener {
    /**
     * Listens for variable changes and calls back when it has changed
     * @param {object} object 
     * @param {string} key 
     * @param {DataChangeCallback} callbackObject 
     * @param {number} refrestRate 
     */
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
        this.interval = setInterval(() => {
            const currentValue = this.object[this.key];
    
            if (this.previousValue === currentValue)
                return;
    
            this.callbackObject.dataChanged();
    
            this.previousValue = currentValue;
        }, this.refrestRate);
    };

    stop() {
        clearInterval(this.interval);
    };
};

export default WaveDataListener;