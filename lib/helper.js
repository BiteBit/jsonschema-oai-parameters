const _ = require('lodash');

function isStandardJsonSchema(schema) {
  return _.has(schema, 'properties') && _.has(schema, 'required');
}

function isConvenientJsonSchema(schema) {
  return _.every(schema, (value, key) => {
    return _.has(value, 'type');
  })
}

function convenientToStandard(schema) {
  const properties = _.mapValues(schema, _.curryRight(_.omit, 2)('required'));
  const standardJsonSchema = {
    type: 'object',
    required: _.keys(_.pickBy(schema, 'required')),
    properties,
  };

  return standardJsonSchema;
}

module.exports = {
  isStandardJsonSchema,
  isConvenientJsonSchema,
  convenientToStandard,
};