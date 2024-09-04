import { WaveDom } from "../core/dom";
import { WaveParser } from "../core/parser";
import { WaveStore } from "../index";

export class WaveApp {
    private selector: string;
    private stores: WaveStore[];
    private dom: WaveDom | undefined;

    constructor(selector: string) {
        this.selector = selector;
        this.stores = [];
    }

    public useStore(store: WaveStore) {
        if (this.dom)
            throw new Error("Cannot use new stores while mounted");

        this.stores.push(store);
    }

    public mount() {
        this.dom = new WaveDom(this.selector);

        for (let i = 0; i < this.stores.length; i++)
            this.stores[i].onDataChange = this.onDataChange.bind(this);

        this.initializeMountedElement();
    }

    public unmount() {
        delete this.dom;
    }

    private initializeMountedElement() {
        if (!this.dom)
            return;

        const elements = this.dom.getAllElements();
        const data = this.getMergedStoreData();
        const keys = Object.keys(data);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = data[key];

            for (let j = 0; j < elements.length; j++) {
                const element = elements[j];

                if (!element.innerHTML.includes(`{{ ${key} }}`))
                    continue;

                element.innerHTML = element.innerHTML.replaceAll(`{{ ${key} }}`, `<span wave-data="${key}">${value}</span>`);
            }
        }

        this.updateConditionals();
    }

    private onDataChange(instance: WaveStore, changedKey: string) {
        if (!this.dom)
            return;

        const elements = this.dom.getElementsByAttribute("wave-data", changedKey);
        const value = instance.getValue(changedKey);

        for (let i = 0; i < elements.length; i++)
            elements[i].innerHTML = value.toString();

        this.updateConditionals();
    }

    private updateConditionals() {
        if (!this.dom)
            return;

        const elements = this.dom.getElementsByAttribute("wave-condition");
        const data = this.getMergedStoreData();

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i] as HTMLElement;
            const attribute = element.getAttribute("wave-condition");

            if (!attribute)
                continue;

            const conditionsMet = WaveParser.parseCondition(attribute, data);

            element.style.display = conditionsMet ? "" : "none";
        }
    }

    private getMergedStoreData() {
        const data: WaveDictionary<any> = {};

        for (let i = 0; i < this.stores.length; i++) {
            const store = this.stores[i];
            const keys = store.getDataKeys();

            for (let j = 0; j < keys.length; j++) {
                const key = keys[j];

                if (data[key])
                    console.warn("Overlapping store keys", key, this);

                data[key] = store.getValue(key);
            }
        }

        return data;
    }
}