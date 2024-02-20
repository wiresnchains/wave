import WaveStore from "./Store";
import WaveDataListener from "./DataListener";
import WaveUtils from "../extra/Utils";
import WaveVirtualDOM from "./VirtualDOM";
import WaveVirtualDOMElement from "./VirtualDOMElement";
import _store from "../_store";

class WaveApp {
    /**
     * Creates an empty app, and sets the data listener refresh rate
     * @param {number} dataRefreshRate
     */
    constructor(dataRefreshRate = 100) {
        this.dataRefreshRate = dataRefreshRate;
        this.store = new WaveStore();
    };

    useStore(store) {
        if (!WaveUtils.IsObjectClassValid(store, WaveStore)) {
            console.error("[WaveApp] Store is not a `WaveStore`");
            return;
        }

        this.store = store;
    };

    mount(elementQuery) {
        if (!this.store || !WaveUtils.IsObjectClassValid(this.store, WaveStore)) {
            console.error("[WaveApp] Store not found, failed to mount app");
            return;
        }

        if (this.virtualDOM) {
            console.error("[WaveApp] App is already mounted");
            return;
        }

        const mountElement = WaveUtils.GetElement(elementQuery);

        if (!mountElement) {
            console.error("[WaveApp] Failed to mount app");
            return;
        }

        this.virtualDOM = new WaveVirtualDOM(mountElement);

        this.initStore();
        this.updateConditionals();
        this.updateEvents();

        this.virtualDOM.updateActualDOM();

        console.log("[Wave/App] Mounted app");
    };

    initStore() {
        if (!this.virtualDOM) {
            console.error("[WaveApp] Attempted to initialize store before mounting app");
            return;
        }

        const keys = Object.keys(this.store.data);
        
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = this.store.data[key];

            const elements = this.virtualDOM.getChildrenRecursive();

            this.store.dataListeners[key] = new WaveDataListener(this.store.data, key, this.dataRefreshRate, () => {
                this.dataChanged();
            });

            for (let j = 0; j < elements.length; j++) {
                const element = elements[j];
                const term = `{{ ${key} }}`;

                if (!element.text || !element.text.includes(term))
                    continue;

                const textElements = element.text.split(term);
                const termOccurances = textElements.length - 1;

                for (let i = 0; i < termOccurances; i++) {
                    if (textElements[i]) {
                        new WaveVirtualDOMElement(element.parent, {
                            text: textElements[i]
                        });
                    }

                    const newElement = new WaveVirtualDOMElement(element.parent, {
                        tag: "span",
                        attributes: {
                            "wave-data": key
                        }
                    });
    
                    new WaveVirtualDOMElement(newElement, {
                        text: `${value}`
                    });
                }

                for (let i = termOccurances; i < textElements.length; i++) {
                    if (!textElements[i])
                        continue;

                    new WaveVirtualDOMElement(element.parent, {
                        text: textElements[i]
                    });
                }

                element.destroy();
            }
        }
    };

    updateConditionals() {
        if (!this.virtualDOM) {
            console.error("[WaveApp] Attempted to update conditionals before mounting app");
            return;
        }

        const elements = this.virtualDOM.getElementsByAttribute("wave-condition");

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const attribute = element.attributes["wave-condition"];

            const conditionsMet = WaveUtils.ParseCondition(attribute, this.store);

            element.visible = conditionsMet;
        }
    };

    updateEvents() {
        if (!this.virtualDOM) {
            console.error("[WaveApp] Attempted to update events before mounting app");
            return;
        }

        const elements = this.virtualDOM.getChildrenRecursive();

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];

            if (!element.attributes)
                continue;

            for (let j = 0; j < _store.events.length; j++) {
                const event = _store.events[j];
                const attribute = element.attributes[`wave-event:${event.name}`];

                if (attribute == undefined)
                    continue;

                const split = attribute.split("(");
                const method = split[0];
                const args = split[1].replace(")", "").split(", ");

                event.handler(element, () => {
                    for (let k = 0; k < args.length; k++) {
                        let argument = WaveUtils.ParseArgument(args[k], this.store);

                        if (argument != undefined) {
                            args[k] = argument;
                            continue;
                        }

                        const elements = this.virtualDOM.getElementsByAttribute("wave-id", args[k]);

                        if (!elements || elements.length < 1) {
                            args[k] = undefined;
                            continue;
                        }

                        const element = elements[0];

                        args[k] = element.htmlElement;
                    }

                    this.store.methods[method](...args);
                });
            }
        }
    };

    dataChanged() {
        if (!this.virtualDOM) {
            console.error("[WaveApp] Attempted to update DOM before mounting app");
            return;
        }

        const keys = Object.keys(this.store.data);
        
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = this.store.data[key];

            const elements = this.virtualDOM.getElementsByAttribute("wave-data", key);

            for (let j = 0; j < elements.length; j++)
                elements[j].text = value;
        }

        this.updateConditionals();
        this.updateEvents();

        this.virtualDOM.updateActualDOM();
    };
    
    unmount() {
        if (!this.virtualDOM) {
            console.error("[WaveApp] Attempted to unmount before mounting app");
            return;
        }

        const keys = Object.keys(this.store.data);
        
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const listener = this.store.dataListeners[key];

            if (!listener)
                continue;

            listener.stop();
            delete this.store.dataListeners[key];
        }

        this.virtualDOM.acutalElement.outerHTML = this.virtualDOM.originalState;

        delete this.virtualDOM;

        console.log("[Wave/App] Unmounted app");
    };
};

export default WaveApp;