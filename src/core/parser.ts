import { LOGICAL_OPERATORS } from "../constants/logicalOperators";

export namespace WaveParser {
    export function parseArgument(argument: string, data: WaveDictionary<any>) {
        const firstChar = argument.charAt(0);
        const lastChar = argument.charAt(argument.length - 1);
        const isString = (firstChar == "\"" || firstChar == "'") && (lastChar == "\"" || lastChar == "'");
    
        const parsedInt = Number(argument);
    
        return !Number.isNaN(parsedInt) ? parsedInt :
            argument == "true" ? true :
            argument == "false" ? false :
            isString ? argument.slice(1).slice(0, -1) :
            data ? (firstChar == "!" ? !(data[argument.slice(1)]) : data[argument]) :
            undefined;
    }

    export function parseCondition(condition: string, data: WaveDictionary<any>) {
        const conditions = condition.split(" && ");

        let conditionsMet = true;

        for (let i = 0; i < conditions.length; i++) {
            const condition = conditions[i];
            let conditionMet = false;

            for (let j = 0; j < LOGICAL_OPERATORS.length; j++) {
                const logicalOperator = LOGICAL_OPERATORS[j];

                if (!condition.includes(logicalOperator.attribute))
                    continue;

                const args = condition.split(logicalOperator.attribute);

                if (args.length < 2)
                    continue;

                conditionMet = logicalOperator.handler(WaveParser.parseArgument(args[0], data), WaveParser.parseArgument(args[1], data));
            }

            if (!conditionMet) {
                conditionsMet = false;
                break;
            }
        }

        return conditionsMet;
    }
}