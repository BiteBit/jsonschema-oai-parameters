
# Simple Useage
## jsonSchemaToParameters(type, schema)
* type allow in: query,path,body,formData,header
* schema standard or convenient jsonschema

### Standard JsonSchema to OpenApi parameters
```js
const standard = {
  required: [
    'name',
  ],
  properties: {
    name: {
      type: 'string',
      description: 'xxx',
    },
    age: {
      type: 'integer',
      format: 'int32',
      max: 100,
      min: 1,
    }
  }
};

jsonSchemaToParameters('query', standard)

[
  {
    "name": "name",
    "in": "query",
    "required": true,
    "type": "string",
    "description": "xxx"
  },
  {
    "name": "age",
    "in": "query",
    "required": false,
    "type": "integer",
    "format": "int32",
    "max": 100,
    "min": 1
  }
]

```

### Convenient JsonSchema to OpenApi parameters
```js
const convenient = {
  name: {
    type: 'string',
    required: true,
    description: 'xxx',
  },
  age: {
    type: 'integer',
    format: 'int32',
    max: 100,
    min: 1,
  },
};

jsonSchemaToParameters('query', convenient)

[
  {
    "name": "name",
    "in": "query",
    "required": true,
    "type": "string"
  },
  {
    "name": "age",
    "in": "query",
    "required": false,
    "type": "integer",
    "format": "int32"
  }
]
```

## parametersToJsonSchema(parameters)
* `result` `{object}`
  * `header` `{object}` header JSON-Schema
  * `query` `{object}` query JSON-Schema
  * `body` `{object}` body JSON-Schema
  * `path` `{object}` path JSON-Schema
  * `formdata` `{object}` formdata JSON-Schema
