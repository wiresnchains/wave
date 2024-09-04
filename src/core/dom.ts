export class WaveDom {
    private parent: Element;

    constructor(selector: string) {
        const element = document.querySelector(selector);

        if (!element)
            throw new Error("Element " + selector + " was not found");

        this.parent = element;
    }

    public getAllElements() {
        return Array.from(this.parent.getElementsByTagName("*"));
    }

    public getElementsByAttribute(attribute: string, value?: string) {
        return Array.from(this.parent.querySelectorAll(`[${attribute}${value ? `=${value}` : ""}]`));
    }
}