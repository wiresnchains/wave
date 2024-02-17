import WaveStore from "./Store";
import WaveDataListener from "./DataListener";
import WaveUtils from "../extra/Utils";
import _store from "../_store";

class WaveApp {
    constructor(dataRefreshRate = 100) {
        this.dataRefreshRate = dataRefreshRate;
        this.store = new WaveStore();
    };

    useStore(store = new WaveStore()) {
        if (!store.constructor || store.constructor.name != "WaveStore") {
            console.error("[WaveApp] Store is not a `WaveStore`");
            return;
        }

        this.store = store;
    };

    mount(elementQuery) {
        if (!this.store) {
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
        const keys = Object.keys(this.store.data);
        
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = this.store.data[key];

            const elements = this.mount.getElementsByTagName("*");

            new WaveDataListener(this.store.data, key, this, this.dataRefreshRate);

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
            const attribute = element.getAttribute("wave-condition");

            const conditions = attribute.split(" && ");
            let conditionsMet = true;

            for (let j = 0; j < conditions.length; j++) {
                let condition = conditions[j];
                let conditionMet = false;

                for (let k = 0; k < _store.logicalOperators.length; k++) {
                    const logicalOperator = _store.logicalOperators[k];
                    
                    if (!condition.includes(logicalOperator.attributeString))
                        continue;

                    const split = condition.split(logicalOperator.attributeString);
                    conditionMet = logicalOperator.handler(WaveUtils.ParseArgument(split[0], this.store.data), WaveUtils.ParseArgument(split[1], this.store.data));
                }

                if (!conditionMet) {
                    conditionsMet = false;
                    break;
                }
            }

            element.style.display = conditionsMet ? "" : "none";
        }
    };

    updateEvents() {
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
                    let argument = WaveUtils.ParseArgument(args[k], this.store.data);

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