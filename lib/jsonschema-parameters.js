const _ = require('lodash');

const helper = require('./helper');

const aliasMaps = {
  query: 'query',
  body: 'body',
  formdata: 'formData',
  path: 'path',
  param: 'path',
  header: 'header',
};

/**
 * Convert JsonSchema draft-04 to OpenApi 2.0 parameter list.
 * @param {string} inx ['query', 'path', 'body', 'formData', 'header']
 * @param {object} schema JsonSchema draft-04
 */
function toParameters(inx, schema) {
  const inType = _.lowerCase(inx).replace(/\s+/, '');
  if (inType !== 'body') {
    const requirements = _.get(schema, 'required');
    const properties = _.get(schema, 'properties');

    return _.map(properties, (similarity, name) => {
      const difference = {
        name,
        in: aliasMaps[inType],
        required: _.includes(requirements, name),
      };
      return _.merge({}, difference, similarity);
    });
  } else {
    const body = [{
      name: 'data',
      in: 'body',
      description: 'Json object',
      required: true,
      schema,
    }]

    return body;
  }
}

/**
 * Convert parameter object to parameter array
  {
    required: [
      'name'
    ],
    properties: {
      name: {
        type: 'string'
      }
    }
  }
  ==============>>>
  [
    {
        "type": "string",
        "name": "name",
        "in": "query",
        "required": true
    }
  ]
 *
 * @param {string} type ['query', 'path', 'body', 'formData', 'header']
 * @param {object} obj
 */
function jsonSchemaToParameters(inx, schema) {
  let realSchema = null;
  if (helper.isStandardJsonSchema(schema)) {
    realSchema = schema;
  } else if (helper.isConvenientJsonSchema(schema)) {
    realSchema = helper.convenientToStandard(schema);
  } else {
    throw new Error('Not supported schema!');
  }

  const ret = {
    jsonschema: realSchema,
    parameters: toParameters(inx, realSchema),
  }

  return ret;
}

module.exports = jsonSchemaToParameters;
