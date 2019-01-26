import ComponentCollection from './ComponentCollection.js';

export default class ComponentMap extends ComponentCollection {

    constructor({ element, data, template }) {
        super({ element, data, template });
    }

    getRenderData() {
        let children = this.children.reduce((obj, child) => {
            obj[child.id || child.name] = this.mapChild(child);
            return obj;
        }, {});
        return { children, ...super.getRenderData() };
    }

    mapChild(child) {
        return child.dataAttributes;
    }
}
