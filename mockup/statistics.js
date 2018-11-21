exports.response = function response(req, res) {
  return {
    "errorCode":"0",
    "success":true,
    "fieldErrors":[],
    "msg":"请求成功！",
    "data":{
      numAll: 333,
      numGov: 222,
      numOp: 111,
      numCompany: 0,
      numApplyAll: 100,
      numApplyDone: 20,
      numApplyTodo: 80
    }
  }
};
