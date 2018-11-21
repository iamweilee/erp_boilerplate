exports.response = function response(req, res) {
  return {
    "errorCode":"0",
    "success": true,
    "fieldErrors":[{ fieldName: 'name', msg: '你错了！！！'}],
    "msg":"出错了",
    "data": 12
  }
}
