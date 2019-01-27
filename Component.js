import EventEmitter from './EventEmitter.js';
import ejs from 'ejs';

export default class Component extends EventEmitter {
    constructor({
        element,
        data = {},
        template = () => '',
        hiddenClass = 'js-hidden'
    }) {
        super();
        this._ownsElement = !(element instanceof Element);
        this.element = this._ownsElement ? this._createElement(element) : element;
        this._data = data;

        if(typeof template != 'function') {
            template = ejs.compile(template);
        }
        
        this._template = template;
        this._hiddenClass = hiddenClass;
    }

    _createElement({ tag = this.defaultTag, name, id }) {
        let element = document.createElement(tag);

        if (name) {
            element.dataset.component = name;
        }

        if (id) {
            element.dataset.componentId = id;
        }

        return element;
    }

    render() {
        this.element.innerHTML = this.generateHTML(this.getRenderData());
    }

    generateHTML(data) {
        return this._template(data);
    }

    hide() {
        this.element.classList.add(this._hiddenClass);
    }

    show() {
        this.element.classList.remove(this._hiddenClass);
    }

    destroy(alwaysRemove) {
        this.element.innerHTML = '';

        if (alwaysRemove || this._ownsElement) {
            this.element.remove();
        }

        super.destroy();
    }

    set data(data) {
        this._data = data;
    }

    get data() {
        return this._data;
    }

    getRenderData() {
        return this._data;
    }

    get defaultTag() {
        return 'div';
    }
}
