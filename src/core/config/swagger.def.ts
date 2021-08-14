const swagger = {
  openapi: '3.0.0',
  info: {
    title: 'Express API',
    version: '1.0.0',
    description: 'The REST API test service',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server',
    },
  ],
  paths: {},
}
export default swagger
