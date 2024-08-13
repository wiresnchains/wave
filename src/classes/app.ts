import { WaveAttributes } from "../extra/attributes";
import { WaveErrors } from "../extra/errors";
import { WaveParser } from "../extra/parser";
import { WaveDataListener } from "./dataListener";
import { WaveDom } from "./dom";
import { WaveStore } from "./store";

class WaveApp {
    private refreshRateMs: number;
    private mountedDom?: WaveDom;
    private nativeStore: WaveStore;
    private store: WaveStore;

    constructor(refreshRateMs: number = 10) {
        this.refreshRateMs = refreshRateMs;
        this.nativeStore = new WaveStore();
        this.store = this.nativeStore;
    }

    public mount(selector: string): void {
        if (this.mountedDom)
            return console.error(WaveErrors.alreadyMounted);

        const element = document.querySelector(selector);

        if (!element)
            return console.error(WaveErrors.unknownElement);

        this.mountedDom = new WaveDom(element);
        
        this.initializeMountedElement();
        this.updateConditionals();
    }

    public unmount(): void {
        if (!this.mountedDom)
            return console.error(WaveErrors.notMounted);

        const keys = Object.keys(this.store.data);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const elements = this.mountedDom.getElementsByAttribute(WaveAttributes.data, key);

            for (let j = 0; j < elements.length; j++)
                elements[j].outerHTML = `{{ ${key} }}`;

            const listener = this.store.dataListeners[key];

            if (!listener)
                continue;

            listener.stop();
            delete this.store.dataListeners[key];
        }

        const conditionElements = this.mountedDom.getElementsByAttribute(WaveAttributes.condition);

        for (let i = 0; i < conditionElements.length; i++) {
            const element = conditionElements[i] as HTMLElement;
            element.style.display = "";
        }

        delete this.mountedDom;
    }

    public useStore(store: WaveStore): void {
        if (this.mountedDom)
            return console.error(WaveErrors.alreadyMounted);

        this.store = store;
    }

    public useNativeStore(): void {
        if (this.mountedDom)
            return console.error(WaveErrors.alreadyMounted);
        
        this.store = this.nativeStore;
    }

    private initializeMountedElement(): void {
        if (!this.mountedDom)
            return console.error(WaveErrors.notMounted);

        const keys = Object.keys(this.store.data);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = this.store.data[key];

            const elements = this.mountedDom.getAllElements();

            const listener = new WaveDataListener(this.store, key, this.refreshRateMs,  this.onDataChange.bind(this));
            this.store.dataListeners[key] = listener;
            listener.start();

            for (let j = 0; j < elements.length; j++) {
                const element = elements[j];

                if (!element.innerHTML.includes(`{{ ${key} }}`))
                    continue;

                element.innerHTML = element.innerHTML.replace(`{{ ${key} }}`, `<span ${WaveAttributes.data}="${key}">${value}</span>`);
            }
        }
    }

    private onDataChange(changedKey: string): void {
        if (!this.mountedDom)
            return console.error(WaveErrors.notMounted);

        const elements = this.mountedDom.getElementsByAttribute(WaveAttributes.data, changedKey);
        const value = this.store.data[changedKey];

        for (let j = 0; j < elements.length; j++)
            elements[j].innerHTML = value;

        this.updateConditionals();
    }

    private updateConditionals(): void {
        if (!this.mountedDom)
            return console.error(WaveErrors.notMounted);

        const elements = this.mountedDom.getElementsByAttribute(WaveAttributes.condition);

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i] as HTMLElement;
            const attribute = element.getAttribute(WaveAttributes.condition);

            if (!attribute)
                continue;

            const conditionsMet = WaveParser.parseCondition(attribute, this.store);

            element.style.display = conditionsMet ? "" : "none";
        }
    }
}

export { WaveApp };