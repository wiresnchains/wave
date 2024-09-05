import { WaveLogicalOperatorHandler } from "../@types/index";

export class WaveLogicalOperator {
    public attribute: string;
    public handler: WaveLogicalOperatorHandler;

    constructor(attribute: string, handler: WaveLogicalOperatorHandler) {
        this.attribute = attribute;
        this.handler = handler;
    }
}