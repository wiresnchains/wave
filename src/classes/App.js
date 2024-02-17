import AppStore from "./AppStore";
import DataListener from "./DataListener";
import Utils from "../extra/Utils";
import store from "../store";

class WaveApp {
    constructor(dataRefreshRate = 100) {
        this.dataRefreshRate = dataRefreshRate;
        this.store = new AppStore();
    };

    useStore(store = new AppStore()) {
        if (!store.constructor || store.constructor.name != "WaveAppStore") {
            console.error("[Wave/App] Store is not a `WaveAppStore`");
            return;
        }

        this.store = store;
    };

    mount(elementQuery) {
        if (!this.store) {
            console.error("[Wave/App] Store not found, failed to mount app");
            return;
        }

        this.mount = Utils.GetElement(elementQuery);

        if (!this.mount) {
            console.error("[Wave/App] Failed to mount app");
            return;
        }

        console.log("[Wave/App] Mounted app");

        this.initStore();
        this.updateConditionals();
        this.updateEvents();
    };

    initStore() {
        const keys = Object.keys(this.store.data);
        
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = this.store.data[key];

            const elements = this.mount.getElementsByTagName("*");

            new DataListener(this.store.data, key, this, this.dataRefreshRate);

            for (let j = 0; j < elements.length; j++) {
                const element = elements[j];

                if (!element.innerHTML.includes(`{{ ${key} }}`))
                    continue;

                element.innerHTML = element.innerHTML.replaceAll(`{{ ${key} }}`, `<span wave-data="${key}">${value}</span>`);
            }
        }
    };

    updateConditionals() {
        const elements = this.mount.querySelectorAll("[wave-condition]");

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            let attribute = element.getAttribute("wave-condition");

            for (let j = 0; j < store.logicalOperators.length; j++) {
                const logicalOperator = store.logicalOperators[j];
                
                if (!attribute.includes(logicalOperator.attributeString))
                    continue;

                attribute = attribute.replaceAll(" ", "");

                const split = attribute.split(logicalOperator.attributeString);

                element.style.display = logicalOperator.handler(Utils.ParseArgument(split[0], this.store.data), Utils.ParseArgument(split[1], this.store.data)) ? "" : "none";
            }
        }
    };

    updateEvents() {
        const elements = this.mount.querySelectorAll("*");

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];

            for (let j = 0; j < store.events.length; j++) {
                const event = store.events[j];
                const attribute = element.getAttribute(`wave-event:${event.name}`);

                if (attribute == undefined)
                    continue;

                const split = attribute.split("(");
                const method = split[0];
                const args = split[1].replace(")", "").split(", ");

                for (let i = 0; i < args.length; i++)
                    args[i] = Utils.ParseArgument(...args, this.store.data);

                event.handler(element, this.store.methods[method], ...args);
            }
        }
    };

    dataChanged() {
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
};

export default WaveApp;