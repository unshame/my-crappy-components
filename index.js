import Component from './Component.js';
import ComponentCollection from './ComponentCollection.js';
import ComponentMap from './ComponentMap.js';
import ComponentArray from './ComponentArray.js';
import componentLoader, {
    loadComponent,
    loadAndCreateComponent,
    createComponent
} from './component-loader.js';

export default componentLoader;

export {
    Component,
    ComponentCollection,
    ComponentMap,
    ComponentArray,

    loadComponent,
    loadAndCreateComponent,
    createComponent
};
