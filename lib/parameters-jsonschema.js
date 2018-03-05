const _ = require('lodash');

/**
 * Convert query, path, header, formData to JSON-Schema
 * @param {object} schema JSON-Schema object wrapper
 * @param {object} param a param info
 * @returns {object} updated schema
 */
function nonBodyJsonSchemaBuilder(schema, param, { lowercaseHeader = false }) {
  let name = param.name;

  if (param.in === 'header' && lowercaseHeader) name = name.toLowerCase();
  if (param.required === true) schema.required = _.union(schema.required, [name]);

  schema.properties[name] = _.omit(param, ['name', 'in', 'required']);

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
  schema.type = _.get(param, 'schema.type', {});
  schema.properties = _.get(param, 'schema.properties', {});
  schema.items = _.get(param, 'schema.items', {});

  return schema;
}

/**
 * Convert OpenAPI parameters list to JSON-Schema object
 * @param {[object]} params
 * @param {object} options
 * @param {boolean} options.lowercaseHeader
 */
function parametersToJsonSchema(params, options = {}) {
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
        nonBodyJsonSchemaBuilder(current, param, options);
        break;
      case 'body':
        bodyJsonSchemaBuilder(current, param, options);
        break;
      default:
        break;
    }
  });

  return results;
}

module.exports = parametersToJsonSchema;
