class WaveVirtualDOMElement {
    /**
     * Create a Virtual DOM element with custom parameters
     * Options is an optional parameter, set to an empty span by default
     * @param {WaveVirtualDOMElement} parent
     * @param {object} options
     */
    constructor(parent, options) {
        this.events = {};
        this.parent = parent;
        this.visible = true;

        if (parent)
            parent.children.push(this);

        if (!options)
            return;

        if (options.text) {
            this.text = options.text;
            return;
        }

        if (!options.tag || !options.attributes)
            return;

        this.tag = options.tag;
        this.attributes = options.attributes;
        this.children = [];
    };

    /**
     * Load Virtual DOM element paremeters from an HTML element or Node
     * WARNING: This does not change the parent specified in the constructor
     * @param {HTNLElement|Node} element
     */
    loadFromDOMElement(element) {
        if (element.nodeType === Node.TEXT_NODE) {
            this.text = element.data;
            return this;
        }

        if (element.nodeType !== Node.ELEMENT_NODE)
            return;

        this.tag = element.tagName;
        this.attributes = Object.assign({}, ...Array.from(element.attributes, ({name, value}) => ({[name]: value})));
        this.children = [];

        for (let i = 0; i < element.childNodes.length; i++)
            new WaveVirtualDOMElement(this).loadFromDOMElement(element.childNodes[i]);

        return this;
    };

    toHTML() {
        if (!this.visible)
            return;

        if (this.text)
            return document.createTextNode(this.text);

        const element = document.createElement(this.tag);

        const attributeKeys = Object.keys(this.attributes);

        for (let i = 0; i < attributeKeys.length; i++) {
            const key = attributeKeys[i];
            const value = this.attributes[key];

            element.setAttribute(key, value);
        }

        const eventKeys = Object.keys(this.events);

        for (let i = 0; i < eventKeys.length; i++) {
            const key = eventKeys[i];
            const value = this.events[key];

            element[key] = value;
        }

        for (let i = 0; i < this.children.length; i++) {
            const node = this.children[i].toHTML();

            if (!node)
                continue;

            element.appendChild(node);
        }

        return element;
    };

    getChildrenRecursive() {
        let children = this.children;

        if (!children)
            return [];

        for (let i = 0; i < this.children.length; i++)
            children = children.concat(this.children[i].getChildrenRecursive());

        return children;
    };

    /**
     * Select all elements by attribute recursively
     * @param {string} attributeName
     * @param {string} value
     */
    getElementsByAttribute(attributeName, value = undefined) {
        let elements = [];

        if (!this.attributes)
            return elements;

        const attribute = this.attributes[attributeName];

        if (attribute !== undefined) {
            if (value !== undefined) {
                if (value === attribute)
                    elements.push(this);
            }
            else
                elements.push(this);
        }

        for (let i = 0; i < this.children.length; i++)
            elements = elements.concat(this.children[i].getElementsByAttribute(attributeName));

        return elements;
    };

    /**
     * Deletes current element
     */
    destroy() {
        const index = this.parent.children.indexOf(this);
        this.parent.children.splice(index, 1);
        delete this;
    }
};

export default WaveVirtualDOMElement;