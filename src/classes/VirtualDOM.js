import WaveVirtualDOMElement from "./VirtualDOMElement";

class WaveVirtualDOM {
    /**
     * Create a virtual dom from an HTML element.
     * @param {HTMLElement} element 
     */
    constructor(parentElement) {
        if (!parentElement) {
            console.error("[WaveVirtualDOM] Failed to initialize, invalid `element` parameter passed");
            return;
        }

        this.originalState = parentElement.outerHTML;
        this.acutalElement = parentElement;
        this.virtualElement = new WaveVirtualDOMElement().loadFromDOMElement(parentElement);
    };

    updateActualDOM() {
        const newActualElement = this.virtualElement.toHTML();

        document.body.insertBefore(newActualElement, this.acutalElement);
        this.acutalElement.remove();
        this.acutalElement = newActualElement;
    };
    
    getChildrenRecursive() {
        return this.virtualElement.getChildrenRecursive();
    };

    /**
     * Select all elements by attribute recursively
     * @param {string} attributeName
     * @param {string} value
     */
    getElementsByAttribute(attributeName, value = undefined) {
        return this.virtualElement.getElementsByAttribute(attributeName, value);
    };
};

export default WaveVirtualDOM;