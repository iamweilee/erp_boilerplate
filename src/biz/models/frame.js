import { parse } from 'qs';
import { message } from 'antd';
import _ from 'underscore';
import { routerRedux } from 'dva/router'

import { userInfo, logout, getDict } from 'biz/services/frame';
import { CRUMB, MENUS, PAGE_URL_PREFIX } from 'common/global/constant';
import dynamicConst from 'common/dynamicConst';
import permission from 'common/permission';

function filterMenus(target) {
  return target.reduce(
    (realMenu, item) => {
      if (permission.isAllow(item.auths)) {
        let newItem = { ...item };
        if (item.children) {
          newItem.children = filterMenus(newItem.children);
        }
        realMenu.push(newItem);
      }
      return realMenu;
    },
    []
  );
}
export default {
  namespace: 'frame',
  state: {
    userName: null,
    userId: null,
    containerClass: 'layout-container',
    header: {
      className: '',
    },
    sider: {
      menus: [],
      current: null
    }
  },
  subscriptions: {
    setup({ dispatch, history, userInfo }) {
      return history.listen(({ pathname, query }) => {
        if (pathname.indexOf(PAGE_URL_PREFIX) !== -1) {
          dispatch({ type: 'selectMenu', payload: { pathname, query } });
        }
      });
    },
  },
  effects: {
    * getData({ payload, }, { call, put, select }) {
      const { userId } = yield select(state => state['frame']);
      // 未登录
      if (!userId) {
        // 获取初始化用户信息
        const response = yield call(userInfo);
        const { data, globalError, success } = response;
        // 返回，正常构建
        if (success) {
          if (data) {
            const { accountInfo, functionList } = data;
              // 后端通过返回null来表达未登录。。。
            if (!functionList) {
              message.error('用户角色失效，跳转回登录页');
              window.location.href = '/logon';
              return false;
            }

            const { userName, id } = accountInfo;
            const authorities = functionList.map(item => item.enName);
            // 权限初始化
            yield put({
              type: 'initAuths',
              payload: { userName: userName, userId: id, authorities }
            });
          }
          // 后端通过返回null来表达未登录。。。
          else {
            window.location.href = '/logon';
            return false;
          }

          const dictRes = yield call(getDict);
          if (dictRes.data) {
            yield put({
              type: 'initConst',
              payload: { ...dictRes.data },
            });
          }
          else {
            message.error('服务出错，请稍后重试');
          }
        }
        // 有错，清空数据并跳转
        else if (globalError) {
          message.error(globalError);
          yield put({
            type: 'clearUser',
          });
        }
      }
    },

    * logout({ payload, }, { call, put }) {
      const { data, error } = yield call(logout);
      if (error) {
        yield put({
          type: 'putLogoutError',
          payload: error.message
        });
      }
      else {
        yield put({ type: 'clearUser', });
        let from = payload === 'clear' ? '' : '?from=' + encodeURIComponent(location.href)
        window.location = `/logon${from}`;
      }
    },
  },
  reducers: {
    initAuths(state, action) {
      let { authorities, userId, userName } = action.payload;
      permission.add(authorities);
      return {
        ...state,
        ...action.payload,
        sider: {
          ...state.sider,
          menus: filterMenus(MENUS)
        },
      }
    },

    clearUser(state, action) {
      return {
        ...state,
        userId: null,
        userName: null,
        sider: {
          menus: [],
          current: null
        }
      };
    },

    resetMenuSelect(state, action) {
      return {
        ...state,
        sider: {
          ...state.sider,
          current: null
        }
      };
    },

    selectMenu(state, action) {
      const { pathname } = action.payload;
      const paths = pathname.replace(PAGE_URL_PREFIX, '').split('/');
      if (paths.length > 2) {
        const topModuleName = paths[1];
        const secondModuleName = paths[2];
        // /housing/manage/ => housingmanage
        let moduleName = topModuleName + secondModuleName;
        return {
          ...state,
          sider: {
            ...state.sider,
            current: moduleName
          }
        };
      }
      return { ...state };
    },

    switchModule(state, action) {
      let { key } = action.payload;
      // screen 是外部跳转，因此不需要switch，但这里的处理不够灵活
      // 后面修复
      if (key === 'screen') {
        return {
          ...state
        }
      }
      return {
        ...state,
        sider: {
          ...state.sider,
          current: key
        }
      };
    },

    initConst(state, action) {
      dynamicConst.build(action.payload);
      return {
        ...state,
      }
    },
  },
};
