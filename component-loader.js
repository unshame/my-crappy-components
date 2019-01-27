import Component from './Component.js';

const ejs = window.ejs;
let useEjs = !!ejs;
const components = {};

export default function setDefinitions(_components, _useEjs = useEjs) {
    for (let [name, componentInfo] of Object.entries(_components)) {
        let { component, template, path, dependencies, noTemplate } = componentInfo;
        components[name] = { component, template, path, dependencies, noTemplate };
    }
    Object.assign(components, _components);
    useEjs = _useEjs;
}

async function loadComponent(name) {
    let componentInfo = components[name];
    let { path, dependencies, noTemplate } = componentInfo;

    if (dependencies) {

        for (let dependecy of dependencies) {

            if (!componentIsLoaded(dependecy)) {
                await loadComponent(dependecy);
            }
        }
    }

    let base = location.href.replace(/[^/]*$/, '');
    let componentPath = base + path + 'component.js';
    let component = (await import(componentPath)).default;
    let template;

    if (!noTemplate) {
        let templatePath = base + path + 'template';

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

    Object.assign(componentInfo, { component, template });

    return componentInfo;
}

function componentIsLoaded(name) {
    return !!components[name].component;
}

async function loadAndCreateComponent(name, options) {

    if (!componentIsLoaded(name)) {
        await loadComponent(name);
    }

    return createComponent(name, options);
}

function createComponent(name, options = {}) {
    let { component, template, noTemplate } = components[name];

    let usingCustomTemplate = false;
    if (options.template) {
        template = options.template;
        usingCustomTemplate = true;
    }

    if (typeof template != 'function') {

        if (usingCustomTemplate || !noTemplate) {
            template = ejs.compile(template);

            if (!usingCustomTemplate) {
                components[name].template = template;
            }
        }
    }

    options = { ...options, template };

    return new component(options);
}

export {
    loadComponent,
    loadAndCreateComponent,
    createComponent
}
