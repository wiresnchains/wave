import { WaveStore } from "../classes/store";
import { WaveRuntimeStore } from "../runtimeStore";

const WaveParser = {
    parseArgument: (argument: string, store: WaveStore) => {
        const firstChar = argument.charAt(0);
        const lastChar = argument.charAt(argument.length - 1);
        const isString = (firstChar == "\"" || firstChar == "'") && (lastChar == "\"" || lastChar == "'");
    
        const parsedInt = Number(argument);
    
        return !Number.isNaN(parsedInt) ? parsedInt :
            argument == "true" ? true :
            argument == "false" ? false :
            isString ? argument.slice(1).slice(0, -1) :
            store ? (firstChar == "!" ? !(store.data[argument.slice(1)]) : store.data[argument]) :
            undefined;
    },

    parseCondition: (condition: string, store: WaveStore) => {
        const conditions = condition.split(" && ");

        let conditionsMet = true;

        for (let i = 0; i < conditions.length; i++) {
            const condition = conditions[i];
            let conditionMet = false;

            for (let j = 0; j < WaveRuntimeStore.logicalOperators.length; j++) {
                const logicalOperator = WaveRuntimeStore.logicalOperators[j];

                if (!condition.includes(logicalOperator.attribute))
                    continue;

                const args = condition.split(logicalOperator.attribute);

                if (args.length < 2)
                    continue;

                conditionMet = logicalOperator.handler(WaveParser.parseArgument(args[0], store), WaveParser.parseArgument(args[1], store));
            }

            if (!conditionMet) {
                conditionsMet = false;
                break;
            }
        }

        return conditionsMet;
    }
}

export { WaveParser };