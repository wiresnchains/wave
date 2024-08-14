class WaveDom {
    public rootElement: Element;

    constructor(rootElement: Element) {
        this.rootElement = rootElement;
    }

    public getElementByAttribute(attribute: string, value?: string): Element {
        return this.getElementsByAttribute(attribute, value)[0];
    }

    public getElementsByAttribute(attribute: string, value?: string): Element[] {
        return Array.from(this.rootElement.querySelectorAll(`[${attribute}${value ? `=${value}` : ""}]`));
    }

    public getAllElements(): Element[] {
        return Array.from(this.rootElement.getElementsByTagName("*"));
    }
}

export { WaveDom };