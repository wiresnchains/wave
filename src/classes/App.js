import WaveStore from "./Store";
import WaveDataListener from "./DataListener";
import WaveUtils from "../extra/Utils";
import _store from "../_store";
import Utils from "../extra/Utils";

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
        if (!Utils.IsObjectClassValid(store, WaveStore)) {
            console.error("[WaveApp] Store is not a `WaveStore`");
            return;
        }

        this.store = store;
    };

    mount(elementQuery) {
        if (!this.store || !Utils.IsObjectClassValid(store, WaveStore)) {
            console.error("[WaveApp] Store not found, failed to mount app");
            return;
        }

        this.mount = WaveUtils.GetElement(elementQuery);

        if (!this.mount) {
            console.error("[WaveApp] Failed to mount app");
            return;
        }

        console.log("[Wave/App] Mounted app");

        this.initStore();
        this.updateConditionals();
        this.updateEvents();
    };

    initStore() {
        if (!this.mount) {
            console.error("[WaveApp] Attempted to initialize store before mounting app");
            return;
        }

        const keys = Object.keys(this.store.data);
        
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = this.store.data[key];

            const elements = this.mount.getElementsByTagName("*");

            this.store.dataListeners[key] = new WaveDataListener(this.store.data, key, this, this.dataRefreshRate);

            for (let j = 0; j < elements.length; j++) {
                const element = elements[j];

                if (!element.innerHTML.includes(`{{ ${key} }}`))
                    continue;

                element.innerHTML = element.innerHTML.replaceAll(`{{ ${key} }}`, `<span wave-data="${key}">${value}</span>`);
            }
        }
    };

    updateConditionals() {
        if (!this.mount) {
            console.error("[WaveApp] Attempted to update conditionals before mounting app");
            return;
        }

        const elements = this.mount.querySelectorAll("[wave-condition]");

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const attribute = element.getAttribute("wave-condition");

            const conditionsMet = Utils.ParseCondition(attribute, this.store);

            element.style.display = conditionsMet ? "" : "none";
        }
    };

    updateEvents() {
        if (!this.mount) {
            console.error("[WaveApp] Attempted to update events before mounting app");
            return;
        }

        const elements = this.mount.querySelectorAll("*");

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];

            for (let j = 0; j < _store.events.length; j++) {
                const event = _store.events[j];
                const attribute = element.getAttribute(`wave-event:${event.name}`);

                if (attribute == undefined)
                    continue;

                const split = attribute.split("(");
                const method = split[0];
                const args = split[1].replace(")", "").split(", ");

                for (let k = 0; k < args.length; k++) {
                    let argument = WaveUtils.ParseArgument(args[k], this.store);

                    if (argument != undefined) {
                        args[k] = argument;
                        continue;
                    }

                    const elements = document.querySelectorAll(`[wave-id="${args[k]}"]`);

                    if (elements.length < 1) {
                        args[k] = undefined;
                        continue;
                    }

                    const element = elements[0];

                    args[k] = element;
                }

                event.handler(element, this.store.methods[method], ...args);
            }
        }
    };

    dataChanged() {
        if (!this.mount) {
            console.error("[WaveApp] Attempted to update DOM before mounting app");
            return;
        }

        const keys = Object.keys(this.store.data);
        
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = this.store.data[key];

            const elements = this.mount.querySelectorAll(`[wave-data="${key}"]`);

            for (let j = 0; j < elements.length; j++)
                elements[j].innerHTML = value;
        }

        this.updateConditionals();
        this.updateEvents();
    };
    
    unmount() {
        if (!this.mount) {
            console.error("[WaveApp] Attempted to unmount before mounting app");
            return;
        }

        const keys = Object.keys(this.store.data);
        
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            const elements = this.mount.querySelectorAll(`[wave-data="${key}"]`);

            for (let j = 0; j < elements.length; j++)
                elements[j].outerHTML = `{{ ${key} }}`;

            const listener = this.store.dataListeners[key];

            if (!listener)
                continue;

            listener.stop();
            delete this.store.dataListeners[key];
        }

        const conditionElements = this.mount.querySelectorAll("[wave-condition]");

        for (let i = 0; i < conditionElements.length; i++)
            conditionElements[i].style.display = "";

        const elements = this.mount.querySelectorAll("*");

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];

            for (let j = 0; j < _store.events.length; j++) {
                const event = _store.events[j];
                const attribute = element.getAttribute(`wave-event:${event.name}`);

                if (attribute == undefined)
                    continue;

                event.handler(element, undefined);
            }
        }

        delete this.mount;

        console.log("[Wave/App] Unmounted app");
    };
};

export default WaveApp;