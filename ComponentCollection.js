import Component from './Component.js';
import { createComponent } from './component-loader.js';

export default class ComponentCollection extends Component {

    constructor({ element, data, template }) {
        super({ element, data, template });
        this.children = [];
        this.childrenById = {};
        this._autoEmbedChildren = true;
        this._autoRenderChildren = true;
    }

    setAutoRenderOptions({ embed = true, render = true }) {
        this._autoEmbedChildren = embed;
        this._autoRenderChildren = render;
    }

    addChild({
        constructor,
        name, id, tag,
        options = {}
    }) {
        options.element = { tag, name, id };
        let component = constructor ? new constructor(options) : createComponent(name, options);
        let dataId = id ? `data-component-id="${id}"` : '';
        let componentInfo = {
            component, name, id,
            selector: `[data-component="${name}"]${dataId ? '[' + dataId + ']' : ''}`,
            dataAttributes: `data-component="${name}"${dataId ? ' ' + dataId : ''}`
        };
        this.children.push(componentInfo);
        this.childrenById[id || name] = componentInfo;
        return component;
    }

    removeChild(child, destroy, alwaysRemove) {
        let index, id;

        if(child instanceof Component) {
            index = this.children.findIndex(otherChild => otherChild.component == child);
            child = this.children[index];
        }
        else if(typeof child == 'object') {
            index = this.children.indexOf(child);
        }
        else if (typeof child == 'number') {
            index = child;
            child = this.children[index];
        }
        else {
            id = child;
            child = this.childrenById[id];
            index = this.children.indexOf(child);
        }

        id = id || child.id || child.name;
        this.children.splice(index, 1);
        delete this.childrenById[id];

        if (destroy) {
            child.component.destroy(alwaysRemove);
        }
    }

    _embedChildren() {
        for (let child of this.children) {
            let { component, selector, hasBeenEmbedded } = child;
            let node = this.element.querySelector(selector);

            if(node) {

                if (!hasBeenEmbedded) {

                    for (let attribute of node.attributes) {
                        component.element.setAttribute(attribute.name, attribute.value);
                    }

                    child.hasBeenEmbedded = true;
                }

                node.replaceWith(component.element);
            }
        }
    }

    _renderChildren() {
        for (let { component } of this.children) {
            component.render();
        }
    }

    render() {
        super.render();

        if (this._autoEmbedChildren) {
            this._embedChildren();
        }

        if (this._autoRenderChildren) {
            this._renderChildren();
        }
    }

    destroy(alwaysRemove, alwaysRemoveSub) {

        for (let { component } of this.children) {
            component.destroy(alwaysRemoveSub);
        }

        super.destroy(alwaysRemove);
    }
}