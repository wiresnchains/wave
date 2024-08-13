import { WaveErrors } from "../extra/errors";
import { WaveStore } from "./store";

type WaveDataListenerCallback = (changedKey: string) => void;

class WaveDataListener {
    private store: WaveStore;
    private key: string;
    private refreshRateMs: number;
    private onDataChange: WaveDataListenerCallback;
    private interval?: number;
    private previousValue: any;

    constructor(store: WaveStore, key: string, refreshRateMs: number, onDataChange: WaveDataListenerCallback) {
        this.store = store;
        this.key = key;
        this.refreshRateMs = refreshRateMs;
        this.onDataChange = onDataChange;
    }

    public start(): void {
        if (this.interval !== undefined)
            return console.error(WaveErrors.alreadyListening);

        this.interval = setInterval(() => {
            this.verifyChanges();
        }, this.refreshRateMs);
    }

    public stop(): void {
        if (this.interval === undefined)
            return console.error(WaveErrors.notListening);

        clearInterval(this.interval);
    }

    private async verifyChanges() {
        const actualValue = this.store.data[this.key];

        if (this.previousValue === actualValue)
            return;

        const proxy = this.store.proxies[this.key];

        if (proxy) {
            this.store.data[this.key] = this.previousValue;

            const result = await proxy(actualValue);

            if (result) {
                this.store.data[this.key] = actualValue;
                this.onDataChange(this.key);
                this.previousValue = actualValue;
            }

            return;
        }

        this.onDataChange(this.key);
        this.previousValue = actualValue;
    }
}

export { WaveDataListener };