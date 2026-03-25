const swaggerJsDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My API",
            version: "1.0.0",
            description: "My project API documentation",
        },
        servers: [
            {
                url: "https://us-central1-pdf-merge-a77ae.cloudfunctions.net/api",
            },
        ],
    },
    apis: ["./index.js"], 
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;