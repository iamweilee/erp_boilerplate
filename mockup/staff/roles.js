exports.response = function response(req, res) {
  return {
    "errorCode":"0",
    "success":true,
    "fieldErrors":[],
    "msg":"请求成功！",
    "data":[
      {
        "name":"超级管理员",
        "id": 1
      },
      {
        "name":"普通政府人员",
        "id": 2
      }
    ]
  }
};
