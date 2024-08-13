import { WaveLogicalOperator } from "./classes/logicalOperator";

const WaveRuntimeStore = {
    logicalOperators: [
        new WaveLogicalOperator(" = ", (data, compareWith) => {
            return data == compareWith;
        }),

        new WaveLogicalOperator(" > ", (data, compareWith) => {
            return data > compareWith;
        }),

        new WaveLogicalOperator(" >= ", (data, compareWith) => {
            return data >= compareWith;
        }),

        new WaveLogicalOperator(" < ", (data, compareWith) => {
            return data < compareWith;
        }),

        new WaveLogicalOperator( " <= ", (data, compareWith) => {
            return data <= compareWith;
        })
    ]
}

export { WaveRuntimeStore };