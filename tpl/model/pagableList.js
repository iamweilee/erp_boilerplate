import { routerRedux } from 'dva/router'
import { message } from 'antd';
import _ from 'underscore';

// 分页的单页大小一般是统一配置的，除非有特殊的需求，就独立配置
import { PAGE_SIZE } from 'common/global/constant';

// 这是一个model的通用抽象
import { effectsCreate, reducers } from 'biz/models/modelCreator';

// 命名空间，这个必须全局唯一，一般的命名规则是路径的驼峰形式，比如 staff/list => staffList, 与View中的那个引用一致
const moduleName = '';

// 可识别模块的路径
const PATH = '';

// 权限配置。有权限系统的时候需要，数组代表满足数组中任一权限均可访问
// 无权限要求设置为[]
const AUTHS = [];

// 默认数据，用于创建及model重置，具体的属性根据业务场景决定
let defaultState = {
  isSearch: false,  // 必须设置
  showForm: false,  // 必须设置
  targetId: null,  // 必须设置
  list: null,  // 必须设置
  total:0,  // 分页时必须设置
  searchParams: {
    pageSize: PAGE_SIZE, // 分页时必须设置
    pageNo: 1, // 分页时必须设置
  },
  crumbList: [] // 面包屑初始值
};

export default {
  namespace: moduleName,
  state: {
    moduleName: moduleName,
    auths: AUTHS,
    ...defaultState
  },
  subscriptions: {
    // 启动执行的钩子
    // 这个方法里面设置的处理是全局执行的，在每个model里面设置一遍是为了功能的汇聚
    // 比如，如果在frame里面设置，就要写好多if来区分，在这里，只写一个跟这个模块相关的
    setup({ history, dispatch }) {
      // 监听 history 变化，当进入 `/` 时触发 `load` action
      return history.listen(({ pathname, query }) => {
        // 如果路径进入此模块，重置数据
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
    // 获取数据的统一入口
    * getData({payload,},{call, put, select}) {
      yield put({ type: 'list' });
    },
    // 获取列表数据
    * list({payload,},{call, put, select}) {
      const model = yield select(state => state[moduleName]);
      let searchParams  = { ...model.searchParams };

      yield put({ type: 'resetList' });

      const response = yield call(list, searchParams);

      yield put({
        type: 'handleResponse',
        payload: { response, callback: 'loadListSuccess', extra: { response } }
      });
    }
  },
  reducers: {
    ...reducers,
  },
}
