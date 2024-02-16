const Helpers = {
    GetElement: (text) => {
        const firstChar = text.charAt(0);
        const type = firstChar == "#" ? "id" : firstChar == "." ? "class" : null;

        if (!type) {
            console.error(`Could not resolve element type: ${text}`);
            return;
        }

        let element = type == "class" ? document.getElementsByClassName(text.slice(1))[0] : document.getElementById(text.slice(1));

        if (!element) {
            console.error(`Element not found: Name: "${text}", type: "${type}"`);
            return;
        }
        
        return element;
    }
};

export default Helpers;