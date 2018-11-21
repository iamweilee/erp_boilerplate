import { parse } from 'qs';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import { message, Modal } from 'antd';
import { login, logout, checkCaptcha, getSmsCode, checkSmsCode, resetPassword, userInfo } from 'biz/services/frame';
import { queryURL } from 'common/utils/transform';
import { effectsCreate, reducers } from 'biz/models/modelCreator';

const moduleName = 'logon';

export default {
  namespace: 'logon',
  state: {
    moduleName: 'logon',
    loginLoading: false,
    mobile: null,
    globalError: null,
    fieldErrors: null,
  },
  subscriptions: {
    setup({ dispatch, history, userInfo }) {
      return history.listen(({ pathname, query }) => {
        if (pathname.match(/\/logon/)) {
          // 进来就执行一下logout
          dispatch({ type: 'logout' });
        }
      });
    },
  },
  effects: {
    ...effectsCreate(),
    * logout({ payload, }, { call, put, select }) {
      const model = yield select(state => state['frame']);
      // 已登录，则强制执行退出操作
      if (model.userId) {
        const { data, error } = yield call(logout);
        if (error) {
          yield put({
            type: 'putLogoutError',
            payload: error.message
          });
        }
      }
    },

    * login({ payload }, { put, call }) {
      yield put({ type: 'showLoginLoading' });
      const rep = yield call(login, payload);
      const { data, globalError, fieldErrors, success } = rep;
      yield put({ type: 'hideLoginLoading' });

      if (!success) {  // 登录失败
        yield put({ // 缓存失败提示信息
          type: 'setGlobalError',
          payload: { globalError, fieldErrors }
        })
      } else {
        const from = queryURL('from');
        if (from) {
          window.location = from;
        } else {
          yield put(routerRedux.push('/page'));
        }
      }
    },
  },
  reducers: {
    ...reducers,
    setGlobalError(state, action){
      return {
        ...state,
        ...action.payload
      }
    },
    removeGlobalError(state){
      return {
        ...state,
        globalError: null
      }
    },
    removeGlobalError(state){
      return {
        ...state,
        globalError: null
      }
    },
    showLoginLoading(state) {
      return {
        ...state,
        loginLoading: true,
      };
    },
    hideLoginLoading(state) {
      return {
        ...state,
        loginLoading: false,
      };
    }
  },
};
