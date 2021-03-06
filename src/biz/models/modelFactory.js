import { PAGE_SIZE } from 'common/global/constant';
import { notification, message } from 'antd';
import { routerRedux } from 'dva/router'
import _ from 'underscore';

export default class ModelFactory {

  constructor(props) {
    this.
  }

  getModel() {
    return {
      effectsCreate() {
        return {
          * innerSaveSuccess({ payload, }, { put }) {
            const { successMessage, successHandler, response } = payload.extra;
            message.success(successMessage);
            successHandler();
          },

          * handleResponse({ payload, }, { call, put }) {
            let { callback, response, extra, errorHandle } = payload;
            let { data, globalError, fieldErrors, success } = response;

            let isSuccess = true;

            if (success) {
              yield put({
                type: callback,
                payload: { data, extra }
              });
            }
            else {
              if (globalError) {
                message.error(globalError, 4);
              }
              if (fieldErrors) {
                yield put({
                  type: 'clearError',
                });

                yield put({
                  type: 'putFieldError',
                  payload: { fieldErrors, }
                });

                if (errorHandle) {
                  yield put({
                    type: errorHandle,
                    payload: { fieldErrors, }
                  });
                }
              }
            }
          },
          * loadListSuccess({ payload, }, { call, put, select }) {
            const { response } = payload.extra;
            const { data } = response;
            yield put({ type: 'initList', payload: data });
          }
        };
      },

      reducers: {
        paramsChange(state, action) {
          return {
            ...state,
            searchParams: {
              ...state.searchParams,
              ...action.payload,
            },
          };
        },

        putFieldError(state, action) {
          const { formId, fieldErrors } = action.payload;
          const errorText = formId ? formId + 'fieldErrors' : 'fieldErrors';

          let realErrors = fieldErrors.reduce(
            (realErrors, { fieldName, msg }) => {
              realErrors[fieldName] = msg;
              return realErrors;
            },
            {}
          );

          return {
            ...state,
            [errorText]: { ...realErrors },
          };
        },

        clearError(state) {
          return {
            ...state,
            fieldErrors: {}
          }
        },

        clearEntity(state, action) {
          return {
            ...state,
            entity: {},
            fieldErrors: {},
          }
        },

        reset(state, action) {
          return {
            ...state,
            ...action.payload
          };
        },

        resetAndParseUrl(state, action) {
          const { defaultState } = state;
          const { query } = action.payload;
          return {
            ...state,
            ...defaultState,
            ...query
          };
        },

        setToSearch(state, action) {
          return {
            ...state,
            isSearch: true
          };
        },

        clearSearch(state, action) {
          return {
            ...state,
            isSearch: false
          };
        },

        initList(state, action) {
          let { list, total } = action.payload;
          list = list.map((item, index) => ({
            ...item,
            key: index + '_' + new Date().getTime(),
            antOrderNumber: index + 1,
          }));

          return {
            ...state,
            list,
            total
          };
        },

        resetList(state, action) {
          return {
            ...state,
            list: null
          };
        },

        /**
         * 控制页面路由级别的展示权限. --2018-1-25.
         * @param state
         * @param action
         * @returns {{allowed}} boolean
         */
        updateAuth(state, action) {
          return {
            ...state,
            allowed: action.payload
          };
        },

        showOrHideDrawerPanel(state, action) {
          let { drawerKeyIndex=0 } = state;
          drawerKeyIndex = drawerKeyIndex + 1;

          return {
            ...state,
            ...action.payload,
            drawerKey: `${state.moduleName}-drawer-${drawerKeyIndex}`,
            drawerKeyIndex
          }
        },

        updateTargetId(state, action) {
          return {
            ...state,
            targetId: action.payload
          }
        }
      },
    };
}
