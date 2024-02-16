import Helpers from "../Helpers.js";
import WaveDataListener from "./DataListener.js";

class WaveApp {
    constructor(mountId, data = {}, dataRefrestRate = 100) {
        this.mount = Helpers.GetElement(mountId);
        this.data = data;
        this.dataRefrestRate = dataRefrestRate;

        this.hook();
    };

    hook() {
        if (!this.checkMount())
            return;

        this.parseVariables();
    };

    parseVariables() {
        if (!this.checkMount())
            return;

        const elements = this.mount.getElementsByTagName("*");

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];

            if (!element.innerHTML.includes("{{ ") || !element.innerHTML.includes(" }}"))
                continue;

            element.innerHTML = element.innerHTML.replaceAll("{{ ", "<span>").replaceAll(" }}", "</span>");

            const subElements = element.getElementsByTagName("span");

            for (let i = 0; i < subElements.length; i++) {
                const subElement = subElements[i];
                subElement.setAttribute("app-data", subElement.innerHTML);

                if (this.data[subElement.innerHTML] == undefined)
                    this.data[subElement.innerHTML] = null;

                new WaveDataListener(this.data, subElement.innerHTML, this, this.dataRefrestRate);

                subElement.innerHTML = this.data[subElement.innerHTML];
            }
        }

        this.dataChanged();
    };

    dataChanged() {
        if (!this.checkMount())
            return;

        for (const [key, value] of Object.entries(this.data)) {
            const element = document.querySelectorAll(`[app-data="${key}"]`)[0];

            if (!element)
                continue;

            element.innerHTML = value;
        }
    };

    checkMount() {
        if (!this.mount) {
            console.error("App not mounted");
            return false;
        }

        return true;
    };
};

export default WaveApp;