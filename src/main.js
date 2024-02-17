import LogicalOperator from "./classes/LogicalOperator";
import Event from "./classes/Event";
import store from "./store";

// Create logical operators
store.logicalOperators.push(new LogicalOperator("=", (data, compareWith) => {
    return data == compareWith;
}));

store.logicalOperators.push(new LogicalOperator(">", (data, compareWith) => {
    return Number(data) > Number(compareWith);
}));

store.logicalOperators.push(new LogicalOperator(">=", (data, compareWith) => {
    return Number(data) >= Number(compareWith);
}));

store.logicalOperators.push(new LogicalOperator("<", (data, compareWith) => {
    return Number(data) < Number(compareWith);
}));

store.logicalOperators.push(new LogicalOperator("<=", (data, compareWith) => {
    return Number(data) <= Number(compareWith);
}));

// Create events
store.events.push(new Event("click", (element, callback, ...args) => {
    element.onclick = () => { callback(...args) };
}));

store.events.push(new Event("input", (element, callback, ...args) => {
    element.oninput = () => { callback(...args) };
}));

store.events.push(new Event("change", (element, callback, ...args) => {
    element.onchange = () => { callback(...args) };
}));

// For bundling
require("./classes/App.js");