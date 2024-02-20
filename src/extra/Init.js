import LogicalOperator from "../classes/LogicalOperator";
import Event from "../classes/Event";

import _store from "../_store";

function CreateLogicalOperators() {
    if (_store.logicalOperators) {
        console.error("[WaveInit] Logical operators are already initialized");
        return;
    }

    _store.logicalOperators = [];

    _store.logicalOperators.push(new LogicalOperator(" = ", (data, compareWith) => {
        return data == compareWith;
    }));
    
    _store.logicalOperators.push(new LogicalOperator(" > ", (data, compareWith) => {
        return data > compareWith;
    }));
    
    _store.logicalOperators.push(new LogicalOperator(" >= ", (data, compareWith) => {
        return data >= compareWith;
    }));
    
    _store.logicalOperators.push(new LogicalOperator(" < ", (data, compareWith) => {
        return data < compareWith;
    }));
    
    _store.logicalOperators.push(new LogicalOperator( " <= ", (data, compareWith) => {
        return data <= compareWith;
    }));
};

function CreateEvents() {
    if (_store.events) {
        console.error("[WaveInit] Events are already initialized");
        return;
    }
    
    _store.events = [];

    _store.events.push(new Event("click", (element, callback) => {
        element.events.onclick = callback ? callback : undefined;
    }));
    
    _store.events.push(new Event("input", (element, callback) => {
        element.events.oninput = callback ? callback : undefined;
    }));
    
    _store.events.push(new Event("change", (element, callback) => {
        element.events.onchange = callback ? callback : undefined;
    }));
};

export default { CreateLogicalOperators, CreateEvents };