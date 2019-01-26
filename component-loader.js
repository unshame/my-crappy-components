import Component from './Component.js';

const ejs = window.ejs;
let useEjs = !!ejs;
const components = {};

export default function setDefinitions(_components, _useEjs = useEjs) {
    Object.assign(components, _components);
    useEjs = _useEjs;
}

async function loadComponent(name) {
    let componentInfo = components[name];
    let { path, dependencies, noTemplate } = componentInfo;

    if (dependencies) {

        for(let dependecy of dependencies) {

            if (!componentIsLoaded(dependecy)) {
                await loadComponent(dependecy);
            }
        }
    }

    let componentPath = location.pathname + path + 'component.js';
    let component = (await import(componentPath)).default;
    let template;

    if (!noTemplate) {
        let templatePath = location.pathname + path + 'template';

        if (useEjs) {
            let response = await fetch(templatePath + '.ejs');
            if (response.ok) {
                let text = await response.text();
                template = ejs.compile(text);
            }
            else {
                throw new Error('Template not found');
            }
        }
        else {
            template = (await import(templatePath + '.js')).default;
        }
    }

    Object.assign(componentInfo, {component, template});

    return componentInfo;
}

function componentIsLoaded(name) {
    return components[name].component && components[name].component instanceof Component;
}

async function loadAndCreateComponent(name, options) {

    if (!componentIsLoaded(name)) {
        await loadComponent(name);
    }

    return createComponent(name, options);
}

function createComponent(name, options = {}) {
    let { component, template } = components[name];
    return new component({ template, ...options });
}

export {
    loadComponent,
    loadAndCreateComponent,
    createComponent
}
