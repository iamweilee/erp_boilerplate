exports.response = function response(req, res) {
  return {
    "success": true,
    "errorCode": 0,
    "fieldErrors": [
    ],
    "msg": "报错信息",
    "data": {
      uploadUrl: 'upload.anhouse.cn',
      viewUrl: 'dfs.anhouse.cn'
    }
  }
}
