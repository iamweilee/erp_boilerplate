import { routerRedux } from 'dva/router'
import _ from 'underscore';

import { list } from 'biz/services/statistics';
import { effectsCreate, reducers } from 'biz/models/modelCreator';
import { message } from 'antd';

const PATH = 'statistic/system';

const moduleName = 'system';

let defaultState = {
  entity: {}
};

export default {
  namespace: moduleName,
  state: {
    moduleName: moduleName,
    crumbList: [{ name: '统计分析', key: 'index' },{ name: '系统统计', key: 'second' }],
    ...defaultState
  },
  subscriptions: {
    setup({ history, dispatch }) {
      // 监听 history 变化，当进入 `/` 时触发 `load` action
      return history.listen(({ pathname, query }) => {
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
      let { data, globalError, success } = yield call(list);
      if (success) {
        yield put({
          type: 'initEntity',
          payload: data
        });
      }
      else if (globalError) {
        message.error(globalError);
      }
    }
  },
  reducers: {
    ...reducers,
    initEntity(state, action) {
      return {
        ...state,
        entity: { ...action.payload }
      };
    }
  }
}
