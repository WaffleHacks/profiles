const schema = {
  type: 'object',
  properties: {
    email: { type: 'string', minLength: 1 },
    firstName: { type: 'string', minLength: 1, maxLength: 64 },
    lastName: { type: 'string', minLength: 1, maxLength: 64 },
  },
};

export default schema;
