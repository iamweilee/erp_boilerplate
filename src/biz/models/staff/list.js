import { message } from 'antd';
import _ from 'underscore';


// 这是一个model的通用抽象
import { effectsCreate, reducers } from 'biz/models/modelCreator';
import { list, resetPassword, unfrozen, frozen } from 'biz/services/staff';

import { omitNullParam } from 'common/utils/transform'

// 分页的单页大小一般是统一配置的，除非有特殊的需求，就独立配置
import { PAGE_SIZE } from 'common/global/constant';

// 这个moduleName会作为model的命名空间使用，与View中的那个引用一致
const moduleName = 'staffList';

// 可识别模块的路径
const PATH = '/staff';

// 权限配置。有权限系统的时候需要，数组代表满足数组中任一权限均可访问
const AUTHS = ['XSBN_ACCOUNT_LIST'];

// 默认数据，用于创建及model重置，具体的属性根据业务场景决定
let defaultState = {
  showForm: false,
  isSearch: false,  // 必须设置
  targetId: null,  // 必须设置
  list: null,  // 必须设置
  total:0,  // 分页时必须设置
  searchParams: {
    pageSize: PAGE_SIZE, // 分页时必须设置
    pageNo: 1, // 分页时必须设置
    keyword: '',
    type: '', /* 账号主体 */
    isDeleted: '', /* 账号状态 */
  },
  crumbList: [
    { name: '员工管理', key: 'index' }
  ]  // 面包屑初始值
};

export default {
  // 命名空间，这个必须全局唯一，一般的命名规则是路径的驼峰形式，比如 staff/list => staffList
  namespace: moduleName,
  state: {
    moduleName: moduleName,
    auths: AUTHS,  // 无权限要求设置为[]
    ...defaultState
  },
  subscriptions: {
    // 启动执行的钩子
    // 这个方法里面设置的处理是全局执行的，在每个model里面设置一遍是为了功能的汇聚
    // 比如，如果在frame里面设置，就要写好多if来区分，在这里，只写一个跟这个模块相关的
    setup({ history, dispatch }) {
      // 监听 history 变化，当进入 `/` 时触发 `load` action
      return history.listen(({ pathname, query }) => {
        // 如果路径进入此模块，重置
        if (pathname.indexOf(PATH) !== -1) {
          dispatch({
            type: 'reset',
            payload: defaultState
          });
        }
      });
    },
  },
  effects: {
    ...effectsCreate(),
    * getData({payload,},{call, put, select}) {
      yield put({ type: 'list' });
    },
    * list({payload,},{call, put, select}) {
      yield put({ type: 'resetList' });

      const model = yield select(state => state[moduleName]);
      let searchParams  = { ...model.searchParams };
      searchParams = omitNullParam(omitNullParam, ['type', 'isDeleted']);

      const response = yield call(list, searchParams);

      yield put({
        type: 'handleResponse',
        payload: { response, callback: 'loadListSuccess', extra: { response, listKey: '' } }
      });
    },
    * updatePwd({ payload }, { call, put, select }) {
      let { data, globalError, fieldErrors=[], success } = yield call(resetPassword, payload);
      if (success) {
        message.success('密码修改成功')
      } else if (fieldErrors[0] && fieldErrors[0].msg) {
        message.error(fieldErrors[0].msg)
      } else {
        message.error(globalError || '密码修改失败');
      }
    },
    * frozen({ payload }, { call, put, select }) {
      let { data, globalError, success } = yield call(frozen, payload);
      if (success) {
        message.success('冻结成功');
        yield put({
          type: 'updateSelectedStatus',
          payload: {
            id: payload,
            isDeleted: 1
          }
        })
      } else {
        message.error(globalError || '服务故障');
      }
    },
    * unfrozen({ payload }, { call, put, select }) {
      let { data, globalError, success } = yield call(unfrozen, payload);
      if (success) {
        message.success('恢复成功');
        yield put({
          type: 'updateSelectedStatus',
          payload: {
            id: payload,
            isDeleted: 0
          }
        })
      } else {
        message.error(globalError || '服务故障');
      }
    }
  },
  reducers: {
    ...reducers,
    initRelatedData(state, action) {
      let { roleList } = action.payload;
      return {
        ...state,
        roleList
      };
    },
    updateSelectedStatus(state, action) {
      const { id, isDeleted } = action.payload || {};
      const list = (state.list || []).map(item => item.id === id ? { ...item, isDeleted } : item)
      return { ...state, list }
    }
  },
}
