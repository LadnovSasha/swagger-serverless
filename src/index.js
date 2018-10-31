const { safeLoad, safeDump } = require('js-yaml');
const { readFileSync, writeFileSync } = require('fs');
const TransformOpenApi = require('./transform');

function upload(path) {
  const doc = readFileSync(path, 'utf-8');

  return safeLoad(doc);
}

function process(path, out) {
  const doc = upload(path);
  const transform = new TransformOpenApi(doc.components);

  const transformedObject = transform.transformComponent();
  const dump = safeDump(Object.assign(doc, { components: transformedObject }), { noRefs: true });

  writeFileSync(out, dump);
}

module.exports = process;
