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

        this.initializeStatements();
        this.updateConditionals();
    }

    private async initializeStatements() {
        if (!this.dom)
            return;

        const mount = this.dom.root;
    
        const regex = /\{\{(.*?)\}\}/g;
        const statements: { type: "data" | "component"; name: string; params: string[]; match: string }[] = [];
    
        for (let match; (match = regex.exec(mount.innerHTML)) != null;) {
            const [fullMatch, innerContent] = match;
            const trimmedContent = innerContent.trim();
            
            if (trimmedContent.includes("(")) {
                const [name, paramsString] = trimmedContent.split(/\s*\(\s*/, 2);
                const params = paramsString.slice(0, -1).match(/('[^']*'|"[^"]*"|[^,\s]+)/g) || [];
                statements.push({ type: "component", name: name.trim(), params, match: fullMatch });
            }
            else
                statements.push({ type: "data", name: trimmedContent, params: [], match: fullMatch });
        }
    
        const data = this.getMergedStoreData();
        const components = this.getMergedStoreComponents();

        const componentPromises: Promise<void>[] = [];

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];

            const parsedParams: any[] = [];

            for (let j = 0; j < statement.params.length; j++) {
                const param = statement.params[j];
                parsedParams.push(WaveParser.parseArgument(param.trim(), data));
            }
    
            switch (statement.type) {
                case "data":
                    this.dom.replace(statement.match, `<span wave-data="${statement.name}">${data[statement.name]}</span>`);
                    break;
                case "component":
                    const uniqueId = `wave-component-${statement.name}-${i}`;
                    const tempReplacement = `<span id="${uniqueId}" style="display: none;">${statement.match}</span>`;
                    
                    this.dom.replace(statement.match, tempReplacement);

                    const componentPromise = new Promise<void>(async (resolve, reject) => {
                        if (!this.dom)
                            return reject(WaveMessages.notMounted);

                        const component = components[statement.name];
                        const content = (await component(...parsedParams)).outerHTML;

                        const tempElement = this.dom.root.querySelector(`#${uniqueId}`);
                        if (tempElement) {
                            tempElement.outerHTML = content;
                        }

                        resolve();
                    });

                    componentPromises.push(componentPromise);

                    break;
            }
        }

        await Promise.all(componentPromises);
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