import componentLoader, { loadAndCreateComponent } from '../index.js';

componentLoader({
    'test': {
        path: 'test/'
    }
});

loadAndCreateComponent('test', {
    element: document.getElementById('test')
});
