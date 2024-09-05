import { WaveLogicalOperator } from "../core/logicalOperator";

export const LOGICAL_OPERATORS = [
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
];