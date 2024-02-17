function GetElement(query) {
    const firstChar = query.charAt(0);
    const type = firstChar == "#" ? "id" : firstChar == "." ? "class" : null;

    if (!type) {
        console.error(`[WaveUtils] Could not resolve element type: ${query}`);
        return;
    }

    let element = type == "class" ? document.getElementsByClassName(query.slice(1))[0] : document.getElementById(query.slice(1));

    if (!element) {
        console.error(`[WaveUtils] Element not found: Name: "${query}", type: "${type}"`);
        return;
    }
    
    return element;
};

function ParseArgument(argument, appStore) {
    const firstChar = argument.charAt(0);
    const lastChar = argument.charAt(argument.length - 1);
    const isString = (firstChar == "\"" || firstChar == "'") && (lastChar == "\"" || lastChar == "'");

    const parsedInt = Number(argument);

    return !Number.isNaN(parsedInt) ? parsedInt :
        argument == "true" ? true :
        argument == "false" ? false :
        isString ? argument.slice(1).slice(0, -1) :
        firstChar == "!" ? !(appStore[argument.slice(1)]) :
        appStore[argument];
};

export default { GetElement, ParseArgument };