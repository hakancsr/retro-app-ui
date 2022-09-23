const path = 'https://run.mocky.io/v3'

const authServiceUrl = process.env.AUTHENTICATION_SERVICE_URL;

export default {
  
  'login': authServiceUrl + "/login",
  'getUsers': authServiceUrl + "/users"
  
}