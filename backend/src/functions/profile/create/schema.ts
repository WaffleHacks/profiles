const schema = {
  type: 'object',
  properties: {
    firstName: { type: 'string', minLength: 1, maxLength: 64 },
    lastName: { type: 'string', minLength: 1, maxLength: 64 },
  },
  required: ['firstName', 'lastName'],
};

export default schema;
