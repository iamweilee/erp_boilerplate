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
          "userName":"你谁啊",
          "authorities": '超级管理员',
          "accountSubjectType": 1,
          "accountStatus": 1,
          "createTime": '2018.01.21',
          "id": 1
        },
        {
          "userName":"你谁啊",
          "authorities": '普通员工',
          "accountSubjectType": 2,
          "accountStatus": 2,
          "createTime": '2017.05.21',
          "id": 2
        },
        {
          "userName":"你谁啊",
          "authorities": '普通员工',
          "accountSubjectType": 1,
          "accountStatus": 1,
          "createTime": '2018.01.21',
          "id": 3
        },
        {
          "userName":"你谁啊",
          "authorities": '普通员工',
          "accountSubjectType": 1,
          "accountStatus": 2,
          "createTime": '2018.01.21',
          "id": 4
        }
      ]
    }
  }
};
