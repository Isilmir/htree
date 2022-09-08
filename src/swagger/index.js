const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Htree swagger',
      version: '1.0.0',
    }
  },
  apis: ['./src/app.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);

module.exports = {openapiSpecification}