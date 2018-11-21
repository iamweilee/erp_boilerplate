import { routerRedux } from 'dva/router'
import { message, Modal } from 'antd';
import _ from 'underscore';

import { read, create, update } from 'biz/services/staff';
import { roleList } from 'biz/services/role';
import { companyList } from 'biz/services/company';
import { effectsCreate, reducers } from 'biz/models/modelCreator';

import { transform } from 'common/utils';
import permission from 'common/permission';

const moduleName = 'staffEdit';
const AUTHS = ['XSBN_ROLE_LIST'];

let defaultState = {
  crumbList: [],
  id: null,
  entity: {
    type: '1'
  },
  rolesList: [],
  companyList: [],
  fieldErrors: {}
};

export default {
  namespace: moduleName,
  state: {
    moduleName: moduleName,
    auths: AUTHS,
    defaultState: {...defaultState},
    ...defaultState
  },
  effects: {
    ...effectsCreate(),
    * getData({ payload, }, { call, put, select }) {
      if (!permission.isAllow(AUTHS)) {
        return false;
      }

      yield put({type: 'resetAndParseUrl', payload: { query: { id: payload }}});

      let [roleListRes, companyListRes] = yield [call(roleList), call(companyList)];
      if (roleListRes.success && companyListRes.success) {
        yield put({
          type: 'initRelatedData',
          payload: {
            roleList: roleListRes.data,
            companyList: companyListRes.data
          }
        });
      }
      else {
        if (roleListRes.globalError) {
          message.error(roleListRes.globalError);
        }
        if (companyListRes.globalError) {
          message.error(companyListRes.globalError);
        }
      }
      let { id } = yield select(state => state[moduleName]);
      if (id) {
        let { success, globalError, data } = yield call(read, id);
        if (success) {
          yield put({
            type: 'initEntity',
            payload: { ...data }
          });
        }
        else if (globalError) {
          message.error(globalError);
        }
      }
    },
    * innerSave({ payload, }, { call, put, select }) {
      let { id } = yield select(state => state[moduleName]);
      let { value, successHandler } = payload;
      let data = { ...value };

      let response;
      let successMessage;
      let backUrl;
      if (id) {
        response = yield call(update, { data, id });
        successMessage = '编辑成功';
      }
      else {
        response = yield call(create, data);
        successMessage = '添加成功';
      }

      yield put({
        type: 'handleResponse',
        payload: { response, callback: 'innerSaveSuccess', extra: { successMessage, response, successHandler } }
      });
    },

    * innerSaveSuccess({ payload, }, { put }) {
      const { successMessage, successHandler, response } = payload.extra;
      message.success(successMessage);
      successHandler();
    }
  },
  reducers: {
    ...reducers,
    initRelatedData(state, action) {
      let { crumbList, id, entity } = state;

      // 编辑
      if (id) {
        crumbList = [
          ...crumbList,
          { name: '编辑员工', key: 'action'}
        ];
      }
      else {
        crumbList = [...crumbList, ...[{ name: '添加员工', key: 'action'}]];
      }

      return {
        ...state,
        ...action.payload,
        crumbList
      };
    },

    switchType(state, action) {
      let type = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          type
        }
      };
    },
  },
}
