const { safeLoad } = require('js-yaml');
const { readFileSync } = require('fs');

function upload(path) {
  const doc = readFileSync(path, 'utf-8');

  return safeLoad(doc);
}

function process(path) {
  const { components } = upload(path);
  transformSchemas(components.schemas);
}

const schemaRegexp = /^#\/components\/schemas\/(\w+)$/;

function transformSchemas(schemas) {
  const workSchemas = Object.assign({}, schemas);

  const transform = (data) => {
    let responseData = Object.assign({}, data);

    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'object') {
        responseData[key] = transform(data[key]);
        return;
      }

      if (key === 'example') {
        delete responseData[key];
      }

      if (key === '$ref') {
        const result = schemaRegexp.exec(data[key]);
        if (!result) {
          throw new Error(`Failed to parse reference ${data[key]}`);
        }

        responseData = workSchemas[result[1]];
        return;
      }
    });

    return responseData;
  };

  const respons = transform(workSchemas);
  return workSchemas;
}

process('mock/v3.0/openapi_v2.yml');
