import { WaveMessages } from "../constants/messages";

export class WaveDom {
    private parent: Element;

    constructor(selector: string) {
        const element = document.querySelector(selector);

        if (!element)
            throw new Error(WaveMessages.elementNotFound.replace("%s", selector));

        this.parent = element;
    }

    public get root() {
        return this.parent;
    }

    public getAllElements() {
        const elements = Array.from(this.parent.children);
        elements.push(this.parent);
        
        return elements;
    }

    public getElementsByAttribute(attribute: string, value?: string) {
        return Array.from(this.parent.querySelectorAll(`[${attribute}${value ? `=${value}` : ""}]`));
    }
}