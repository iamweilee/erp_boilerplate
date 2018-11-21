exports.response = function response(req, res) {
  return {
    "errorCode": "0",
    "success": true,
    "fieldErrors": [],
    "msg": "请求成功！",
    "data": {
      "total": 19,
      "aArticleList": [
        {
            "id": 34, //资讯id
            "title": "标题3fr", //标题
            "content": "资讯内容",//正文
            "categoryId": 1,//分类
            "categoryName": 1,// 分类名（最好返回映射后的文字，不然可能需要单独获取一个接口拉到分类列表）
            "readCount": 0,//阅读数
            "editor": "whj",//编辑者
            "creator": "创建人",//作专
            "source": "ksjdhdjh",//来源
            "publishStatus": "发布",//状态（草稿,发布）
            "status": 1,
            "publishedAt": "2017-09-30 17:22:09",//发布时间
            "createdAt": "2017-09-30 17:21:14",//创建时间
            "updatedAt": "2017-10-01 09:52:02",//更新时间
            "deletedAt": "2017-09-30 17:24:12",//删除时间
            "sCategory": "政策发布"//分类名称
        }
      ]
    }
  };
}
