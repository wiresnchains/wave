import Helpers from "../Helpers.js";
import WaveDataListener from "./DataListener.js";

class WaveApp {
    constructor(mountId, data = {}, methods = {}, dataRefrestRate = 100) {
        this.mount = Helpers.GetElement(mountId);
        this.data = data;
        this.methods = methods;
        this.dataRefrestRate = dataRefrestRate;

        this.hook();
    };

    hook() {
        if (!this.checkMount())
            return;

        this.initVariables();
        this.parseVariables();
    };

    initVariables() {
        const keys = Object.keys(this.data);

        for (let i = 0; i < keys.length; i++)
            new WaveDataListener(this.data, keys[i], this, this.dataRefrestRate);
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
                subElement.setAttribute("wave-data", subElement.innerHTML);

                if (this.data[subElement.innerHTML] == undefined) {
                    this.data[subElement.innerHTML] = null;
                    new WaveDataListener(this.data, subElement.innerHTML, this, this.dataRefrestRate);
                }

                subElement.innerHTML = this.data[subElement.innerHTML];
            }
        }

        this.dataChanged();
    };

    dataChanged() {
        if (!this.checkMount())
            return;

        const keys = Object.keys(this.data);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = this.data[key];

            const elements = this.mount.querySelectorAll(`[wave-data="${key}"]`);

            for (let i = 0; i < elements.length; i++)
                elements[i].innerHTML = value;
        }

        this.parseAttributes();
    };

    parseAttributes() {
        if (!this.checkMount())
            return;

        this.hookConditionals();
        this.hookEvents();
    };

    hookConditionals() {
        const elements = this.mount.querySelectorAll("[wave-condition]");

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const attribute = element.getAttribute("wave-condition");

            const operatorType = Helpers.GetLogicalOperatorType(attribute);

            let condition = false;

            switch (operatorType) {
                case Helpers.LogicalOperators.Equals: {
                    const split = attribute.split(" = ")
                    condition = this.data[split[0]] == split[1];
                    break;
                }
                case Helpers.LogicalOperators.MoreThan: {
                    const split = attribute.split(" > ")
                    condition = this.data[split[0]] > Number(split[1]);
                    break;
                }
                case Helpers.LogicalOperators.MoreThanOrEqual: {
                    const split = attribute.split(" >= ")
                    condition = this.data[split[0]] >= Number(split[1]);
                    break;
                }
                case Helpers.LogicalOperators.LessThan: {
                    const split = attribute.split(" < ")
                    condition = this.data[split[0]] < Number(split[1]);
                    break;
                }
                case Helpers.LogicalOperators.LessThanOrEqual: {
                    const split = attribute.split(" <= ")
                    condition = this.data[split[0]] <= Number(split[1]);
                    break;
                }
            }

            element.style.display = condition ? "" : "none";
        }
    };

    hookEvents() {
        this.hookClickEvent();
    };

    hookClickEvent() {
        const elements = this.mount.querySelectorAll("[wave-click]");

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const attribute = element.getAttribute("wave-click");

            element.onclick = this.methods[attribute];
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