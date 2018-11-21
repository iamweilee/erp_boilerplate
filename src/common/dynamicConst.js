/**
 * @file 后端字段管理对象
 */

let instance = null;

class DynamicConst {

  const = {}

  constructor() {
    if (!instance) instance = this;
    return instance;
  }

  /**
   * 添加权限
   *
   * @param {Array} authorities 权限说明
   */
  build(data) {
    // 图片上传，预览要适配一下
    this.const = { ...data };

    if (data.uploadUrl) {
      this.const.uploadUrl = `https://${data.uploadUrl}/upload/house.html`;
    }
    //if (data.viewUrl) {
      this.const.viewUrl = `https://${data.viewUrl || 'img.anhouse.cn'}/view/house`;
    //}
  }

  getItem(key) {
    return this.const[key];
  }

  toCheckArray(key) {
    let item = this.const[key];
    if (!item) {
      return [];
    }

    return Object.keys(item).map(
      (key) => {
        return { label: item[key], value: key };
      },
    )
  }

  getTextFromValue(key, value) {
    let item = this.getItem(key);
    return item ? item[value] : null;
  }

}

export default new DynamicConst();
