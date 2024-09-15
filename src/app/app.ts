import { WaveComponentHandler, WaveDictionary } from "../@types/index";
import { WaveAttributes } from "../constants/attributes";
import { WaveMessages } from "../constants/messages";
import { WaveDom } from "../core/dom";
import { WaveParser } from "../core/parser";
import { WaveStore } from "./store";

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
            throw new Error(WaveMessages.mountedUseStore);

        this.stores.push(store);
    }
    
    public useStores(...stores: WaveStore[]) {
        for (let i = 0; i < stores.length; i++)
            this.useStore(stores[i]);
    }

    public mount() {
        if (this.dom)
            throw new Error(WaveMessages.alreadyMounted);

        this.dom = new WaveDom(this.selector);

        for (let i = 0; i < this.stores.length; i++)
            this.stores[i].addDataChangeCallback(this.onDataChange.bind(this));

        this.initializeMountedElement();
    }

    public unmount() {
        if (!this.dom)
            throw new Error(WaveMessages.notMounted);

        const data = this.getMergedStoreData();
        const keys = Object.keys(data);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const elements = this.dom.getElementsByAttribute(WaveAttributes.data, key);

            for (let j = 0; j < elements.length; j++)
                elements[j].outerHTML = `{{ ${key} }}`;
        }

        const conditionElements = this.dom.getElementsByAttribute(WaveAttributes.condition);

        for (let i = 0; i < conditionElements.length; i++) {
            const element = conditionElements[i] as HTMLElement;

            if (element.style.display != "none")
                continue;

            element.style.display = "";
        }

        delete this.dom;
    }

    public getMount() {
        if (!this.dom)
            throw new Error(WaveMessages.notMounted);

        return this.dom.root;
    }

    private initializeMountedElement() {
        if (!this.dom)
            return;

        this.initializeComponents();
        this.initializeData();
        this.updateConditionals();
    }

    private initializeData() {
        if (!this.dom)
            return;

        const data = this.getMergedStoreData();
        const keys = Object.keys(data);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = data[key];

            this.dom.root.innerHTML = this.dom.root.innerHTML.replaceAll(`{{ ${key} }}`, `<span ${WaveAttributes.data}="${key}">${value}</span>`);
        }
    }

    // TODO: Component parameters {{ component_call(params) }}
    private initializeComponents() {
        if (!this.dom)
            return;
        
        const components = this.getMergedStoreComponents();
        const keys = Object.keys(components);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const handler = components[key];
            
            this.dom.root.innerHTML = this.dom.root.innerHTML.replaceAll(`{{ ${key} }}`, handler().outerHTML);
        }
    }

    private onDataChange(instance: WaveStore, changedKey: string) {
        if (!this.dom)
            return;

        const elements = this.dom.getElementsByAttribute(WaveAttributes.data, changedKey);
        const value = instance.getValue(changedKey);

        for (let i = 0; i < elements.length; i++)
            elements[i].innerHTML = value.toString();

        this.updateConditionals();
    }

    private updateConditionals() {
        if (!this.dom)
            return;

        const elements = this.dom.getElementsByAttribute(WaveAttributes.condition);
        const data = this.getMergedStoreData();

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i] as HTMLElement;
            const attribute = element.getAttribute(WaveAttributes.condition);

            if (!attribute)
                continue;

            const conditionsMet = WaveParser.parseCondition(attribute, data);

            element.style.display = conditionsMet ? "" : "none";
        }
    }

    private updateComponents() {
        if (!this.dom)
            return;

        const elements = this.dom.getElementsByAttribute(WaveAttributes.condition);
        const components = this.getMergedStoreComponents();
    }

    private getMergedStoreData() {
        const data: WaveDictionary<any> = {};

        for (let i = 0; i < this.stores.length; i++) {
            const store = this.stores[i];
            const keys = store.getDataKeys();

            for (let j = 0; j < keys.length; j++) {
                const key = keys[j];

                if (data[key])
                    console.warn(WaveMessages.storeKeyOverlap, key, this);

                data[key] = store.getValue(key);
            }
        }

        return data;
    }

    private getMergedStoreComponents() {
        const components: WaveDictionary<WaveComponentHandler> = {};

        for (let i = 0; i < this.stores.length; i++) {
            const store = this.stores[i];
            const keys = store.getComponentKeys();

            for (let j = 0; j < keys.length; j++) {
                const key = keys[j];

                if (components[key])
                    console.warn(WaveMessages.storeKeyOverlap, key, this);

                components[key] = store.getComponentHandler(key);
            }
        }

        return components;
    }
}