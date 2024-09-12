import { WaveDictionary } from "../@types/index";
import { WaveLogicalOperators } from "../constants/logicalOperators";

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

            // TODO: I didn't replace WaveLogicalOperators with a dictionary just to do this :(
            const operators  = Object.keys(WaveLogicalOperators);

            for (let j = 0; j < operators.length; j++) {
                const logicalOperator = operators[j];
                const handler = WaveLogicalOperators[logicalOperator];

                if (!condition.includes(logicalOperator))
                    continue;

                const args = condition.split(logicalOperator);

                if (args.length < 2)
                    continue;

                conditionMet = handler(WaveParser.parseArgument(args[0], data), WaveParser.parseArgument(args[1], data));
            }

            if (!conditionMet) {
                conditionsMet = false;
                break;
            }
        }

        return conditionsMet;
    }
}