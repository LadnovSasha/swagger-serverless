class TransformOpenApi {
  constructor(component) {
    this.component = Object.assign({}, component);
    this.refRegexp = /^#\/components\/(\w+)\/(\w+)$/;
    this.unsupportedKeys = ['example'];
  }

  parseRef(ref) {
    const [, component, child] = this.refRegexp.exec(ref) || [];

    if (!component || !child) {
      throw new Error(`Failed to parse reference ${ref}`);
    }

    return this.component[component][child];
  }

  transform(data) {
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'object') {
        data[key] = this.transform(data[key]);
        return;
      }

      if (this.unsupportedKeys.indexOf(key) > -1) {
        delete data[key];
      }

      if (key === '$ref') {
        data = this.parseRef(data[key]);
        return;
      }
    });

    return data;
  }

  transformComponent() {
    return this.transform(this.component);
  }
}

module.exports = TransformOpenApi;
