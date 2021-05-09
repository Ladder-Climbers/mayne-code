class API {
  constructor() {
    this.host = "127.0.0.1";
    this.port = 8080;
    this.protol = 'http';
    this.api_version = 'v1';
    this.url = `${this.protol}://${this.host}:${this.port}/api/${this.api_version}`;
  }
  async request(router, method='GET', data) {
    const url = `${this.url}/${router}`;
    return fetch(url, {
      method: method,
      body: data
    });
  }
};

const api = new API();

export { api };