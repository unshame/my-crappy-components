import ComponentCollection from './ComponentCollection.js';

export default class ComponentArray extends ComponentCollection {

    constructor({ element, data, template }) {
        super({ element, data, template });
    }

    getRenderData() {
        let data = {
            children: this.filterChildren(this.children).map(child => this.mapChild(child))
        };
        return Object.assign(data, super.getRenderData());
    }

    filterChildren(children) {
        return children;
    }

    mapChild(child) {
        return child.dataAttributes;
    }
}
