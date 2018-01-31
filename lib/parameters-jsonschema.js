const _ = require('lodash');

/**
 * Convert query, path, header, formData to JSON-Schema
 * @param {object} schema JSON-Schema object wrapper
 * @param {object} param a param info
 * @returns {object} updated schema
 */
function nonBodyJsonSchemaBuilder(schema, param) {
  schema.properties[param.name] = _.omit(param, ['name', 'in', 'required']);

  if (param.required) {
    schema.required = _.union(schema.required, [param.name]);
  }

  return schema;
}

/**
 * Convert body to JSON-Schema
 * @param {object} schema JSON-Schema object wrapper
 * @param {object} param a param info
 * @returns {object} updated schema
 */
function bodyJsonSchemaBuilder(schema, param) {
  schema.required = _.get(param, 'schema.required', []);
  schema.properties = _.get(param, 'schema.properties', {});

  return schema;
}

/**
 * Convert OpenAPI parameters list to JSON-Schema object
 * @param {[object]} params
 */
function parametersToJsonSchema(params) {
  const schema = {
    type: 'object',
    required: [],
    properties: {},
  };

  const results = {
    header: _.cloneDeep(schema),
    query: _.cloneDeep(schema),
    body: _.cloneDeep(schema),
    path: _.cloneDeep(schema),
    formdata: _.cloneDeep(schema),
  };

  _.each(params, (param) => {
    const pos = _.toLower(param.in);
    const current = _.get(results, pos);

    switch (pos) {
      case 'query':
      case 'path':
      case 'header':
      case 'formdata':
        nonBodyJsonSchemaBuilder(current, param);
        break;
      case 'body':
        bodyJsonSchemaBuilder(current, param);
        break;
      default:
        break;
    }
  });

  return results;
}

module.exports = parametersToJsonSchema;
