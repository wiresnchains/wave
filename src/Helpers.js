const Helpers = {
    LogicalOperators: {
        Equals: 0,
        MoreThan: 1,
        MoreThanOrEqual: 2,
        LessThan: 3,
        LessThanOrEqual: 4,
    },

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
    },

    GetLogicalOperatorType: (text) => {
        if (text.includes(" = "))
            return Helpers.LogicalOperators.Equals;
        else if (text.includes(" > "))
            return Helpers.LogicalOperators.MoreThan;
        else if (text.includes(" >= "))
            return Helpers.LogicalOperators.MoreThanOrEqual;
        else if (text.includes(" < "))
            return Helpers.LogicalOperators.LessThan;
        else if (text.includes(" <- "))
            return Helpers.LogicalOperators.LessThanOrEqual;
    }
};

export default Helpers;