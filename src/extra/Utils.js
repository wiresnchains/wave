import WaveStore from "../classes/Store";
import _store from "../_store";

/**
 * Search for a DOM element by it's class name or id
 * @param {string} query
 * @returns {HTMLElement|undefined}
 */
function GetElement(query) {
    if (!query || typeof(query) !== "string")
        return;
    
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

/**
 * Check if the object's class is correct
 * @param {object} object
 * @param {class} requiredClass
 */
function IsObjectClassValid(object, requiredClass) {
    return object.constructor && object.constructor.name === requiredClass.name;
};

/**
 * Parse an argument from a string
 * @param {string} argument
 * @param {WaveStore} waveStore
 * @returns {any}
 */
function ParseArgument(argument, waveStore) {
    if (!argument || typeof(argument) !== "string" || !IsObjectClassValid(waveStore, WaveStore))
        return undefined;

    const firstChar = argument.charAt(0);
    const lastChar = argument.charAt(argument.length - 1);
    const isString = (firstChar == "\"" || firstChar == "'") && (lastChar == "\"" || lastChar == "'");

    const parsedInt = Number(argument);

    return !Number.isNaN(parsedInt) ? parsedInt :
        argument == "true" ? true :
        argument == "false" ? false :
        isString ? argument.slice(1).slice(0, -1) :
        waveStore ? (firstChar == "!" ? !(waveStore.data[argument.slice(1)]) : waveStore.data[argument]) :
        undefined;
};

/**
 * Parse the "wave-condition" attribute in the DOM
 * @param {string} conditionString
 * @param {WaveStore} waveStore
 * @returns {boolean}
 */
function ParseCondition(conditionString, waveStore) {
    if (!IsObjectClassValid(waveStore, WaveStore)) {
        console.error("[WaveUtils] Invalid `waveStore` class");
        return false;
    }

    const conditions = conditionString.split(" && ");

    let conditionsMet = true;

    for (let i = 0; i < conditions.length; i++) {
        const condition = conditions[i];
        let conditionMet = false;

        for (let j = 0; j < _store.logicalOperators.length; j++) {
            const logicalOperator = _store.logicalOperators[j];

            if (!condition.includes(logicalOperator.attributeString))
                continue;

            const args = condition.split(logicalOperator.attributeString);

            if (args.length < 2)
                continue;

            conditionMet = logicalOperator.handler(ParseArgument(args[0], waveStore), ParseArgument(args[1], waveStore));
        }

        if (!conditionMet) {
            conditionsMet = false;
            break;
        }
    }

    return conditionsMet;
};

export default { GetElement, IsObjectClassValid, ParseArgument, ParseCondition };