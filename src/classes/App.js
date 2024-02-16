import AppStore from "./AppStore";
import DataListener from "./DataListener";
import store from "../store";

function getElement(query) {
    const firstChar = query.charAt(0);
    const type = firstChar == "#" ? "id" : firstChar == "." ? "class" : null;

    if (!type) {
        console.error(`[Wave/App] Could not resolve element type: ${query}`);
        return;
    }

    let element = type == "class" ? document.getElementsByClassName(query.slice(1))[0] : document.getElementById(query.slice(1));

    if (!element) {
        console.error(`Element not found: Name: "${query}", type: "${type}"`);
        return;
    }
    
    return element;
};

class WaveApp {
    constructor(mountId, store, dataRefreshRate) {
        this.mountId = mountId;
        this.store = store || new AppStore();
        this.dataRefreshRate = dataRefreshRate;

        this.mount();
    };

    mount() {
        this.mount = getElement(this.mountId);

        if (!this.checkMount())
            return;

        console.log("[Wave/App] Mounted");

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
            const attribute = element.getAttribute("wave-condition");

            for (let j = 0; j < store.logicalOperators.length; j++) {
                const logicalOperator = store.logicalOperators[j];
                
                if (!attribute.includes(logicalOperator.attributeString))
                    continue;

                const split = attribute.split(logicalOperator.attributeString);

                element.style.display = logicalOperator.handler(this.store.data[split[0]], split[1]) ? "" : "none";
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

    checkMount() {
        if (!this.mount) {
            console.error(`[Wave/App] Failed to mount app`);
            return false;
        }

        return true;
    }
};

export default WaveApp;