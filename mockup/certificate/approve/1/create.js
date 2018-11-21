exports.response = function response(req, res) {
  return {
    "success": false,
    "errorCode": 0,
    "msg": "已经存在认证过的营业执照号，请予以驳回！",
    "data": {}
  }
}
