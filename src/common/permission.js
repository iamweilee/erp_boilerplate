/**
 * @file 权限管理对象
 */

let instance = null;

class Permission {

  authorities = []

  constructor() {
    if (!instance) instance = this;
    return instance;
  }

  /**
   * 添加权限
   *
   * @param {Array} authorities 权限说明
   */
  add(authorities) {
    this.authorities = [ ...authorities ];
  }

  /**
   * 判断是否拥有指定权限
   *
   * @param {string} name 权限名称
   * @return {boolean} 是否拥有`name`表示的权限
   */
  isAllow (auths) {
    // 不设置权限
    // 设置权限，拥有任一权限
    if (auths.length === 0 || auths.find((auth) => this.authorities.indexOf(auth) !== -1)) {
      return true;
    }
    return false;
  }

}

export default new Permission();
