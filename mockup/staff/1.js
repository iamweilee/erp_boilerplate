exports.response = function response(req, res) {
  return {
    "errorCode":"0",
    "success":true,
    "fieldErrors":[],
    "msg":"请求成功！",
    "data":{
      "name":"你谁啊",
      "roleId": 1,
      "id": 1,
      "password": 'fdfsdsdsdsd',
      "mobile": "121212121211"
    }
  }
};
