let { endpoints } = require('../build/index');

endpoints = endpoints.map((endpoint) => {
    endpoint.methods = endpoint.methods.join(", ");
    endpoint.middlewares = endpoint.middlewares.join(", ");
    return endpoint;
})

console.table(endpoints);

process.exit(0);