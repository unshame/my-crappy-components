import ComponentCollection from './ComponentCollection.js';

export default class ComponentArray extends ComponentCollection {

    constructor({ element, data, template }) {
        super({ element, data, template });
    }

    getRenderData() {
        let children = this.filterChildren(this.children).map(child => this.mapChild(child));
        return { children, ...super.getRenderData() };
    }

    filterChildren(children) {
        return children;
    }

    mapChild(child) {
        return child.dataAttributes;
    }
}
