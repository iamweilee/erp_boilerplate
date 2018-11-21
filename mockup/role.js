exports.response = function response(req, res) {
  return {
    "errorCode":"0",
    "success":true,
    "fieldErrors":[],
    "msg":"请求成功！",
    "data":{
      "total":15,
      "list":[
        {
          "name":"超级管理员",
          "id": 1
        },
        {
          "name":"审核员",
          "id": 2
        }
      ]
    }
  }
};
