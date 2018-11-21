exports.response = function response(req, res) {
  let functionList = [
    'XSBN_ACCOUNT_LIST', 'XSBN_ACCOUNT_DETAIL', 'XSBN_ACCOUNT_ADD', 'XSBN_ACCOUNT_EDIT', 'XSBN_ACCOUNT_DELETE', 'XSBN_ACCOUNT_FROZEN',
    'XSBN_ACCOUNT_UNFROZEN', 'XSBN_ACCOUNT_RESET_PASSWORD',
    'XSBN_ROLE_DROP_DOWN_LIST', 'XSBN_COMPANY_DROP_DOWN_LIST',
    'XSBN_APPLY_LIST', 'XSBN_APPLY_DETAIL', 'XSBN_APPLY_UPDATE', 'XSBN_APPLY_DOWNLOAD', 'XSBN_LOG_DETAIL',
    'XSBN_ROLE_LIST', 'XSBN_ROLE_DETAIL', 'XSBN_ROLE_ADD', 'XSBN_ROLE_EDIT', 'XSBN_ROLE_DELETE',
    'XSBN_ARTICLE_ALL', 'XSBN_SUMMARY_STATISTICS'
  ];
  return {
    "errorCode":"0",
    "success":true,
    "fieldErrors":null,
    "msg":null,
    "data":{
      "accountInfo": {
        "id": 1,
        "isRoot": 0,
        "remark": "string",
        "type": 0,
        "userName": "lixiang664"
      },
      "functionList": functionList.map(item => ({ enName: item }))
    }
  };
}
