const schema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
  },
  required: ['firstName', 'lastName'],
};

export default schema;
