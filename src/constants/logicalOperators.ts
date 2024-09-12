import { WaveDictionary, WaveLogicalOperatorHandler } from "../@types/index";

export const WaveLogicalOperators: WaveDictionary<WaveLogicalOperatorHandler> = {
    " = ": (data, compareWith) => {
        return data == compareWith;
    },

    " > ": (data, compareWith) => {
        return data > compareWith;
    },

    " >= ": (data, compareWith) => {
        return data >= compareWith;
    },

    " < ": (data, compareWith) => {
        return data < compareWith;
    },

    " <= ": (data, compareWith) => {
        return data <= compareWith;
    }
}