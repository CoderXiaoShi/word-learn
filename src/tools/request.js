const axios = require('axios')
const { baseURL } = require('../../config')

const instance = axios.create({
  baseURL,
  timeout: 1e4,
});

instance.interceptors.request.use(config => config,
  err => Promise.reject(err));

instance.interceptors.response.use(response => response.data,
  err => Promise.reject(err));

module.exports = instance
