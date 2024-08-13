type LogicalOperatorHandler = (data: any, compareWith: any) => boolean

class WaveLogicalOperator {
    public attribute: string;
    public handler: LogicalOperatorHandler;

    constructor(attribute: string, handler: LogicalOperatorHandler) {
        this.attribute = attribute;
        this.handler = handler;
    }
}

export { WaveLogicalOperator };