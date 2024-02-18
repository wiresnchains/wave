/**
 * @name LogicalHandler
 * @function
 * @param {any} data
 * @param {any} compareWith
 */

class WaveLogicalOperator {
    /**
     * Creates a logical operator
     * @param {string} name
     * @param {LogicalHandler} handler
     */
    constructor(attributeString, handler) {
        this.attributeString = attributeString;
        this.handler = handler;
    }
};

export default WaveLogicalOperator;