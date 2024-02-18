/**
 * @name EventCallback
 * @function
 * @param {any} ..args
 */

/**
 * @name EventHandler
 * @function
 * @param {HTMLElement} element
 * @param {EventCallback} callback
 * @param {any} ..args
 */

class WaveEvent {
    /**
     * Creates an event type for "wave-event" attribute
     * @param {string} name
     * @param {EventHandler} handler
     */
    constructor(name, handler) {
        this.name = name;
        this.handler = handler;
    }
};

export default WaveEvent;