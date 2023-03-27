class CustomElement {
    constructor(el) {
        this.el = el;
    }

    addEventListener(type, handler, flag) {
        this.el.addEventListener(type, handler, flag);
        return this;
    }

    addEventsListener(eventTypes, handler, flag) {
        eventTypes.forEach(eventType => {
            this.el.addEventListener(eventType, handler, flag);
        });

        return this;
    };
}

module.exports = CustomElement;
