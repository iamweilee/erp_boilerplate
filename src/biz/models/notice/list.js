import { routerRedux } from 'dva/router'
import { message } from 'antd';
import _ from 'underscore';

import { list, offline, publish, remove, getCategoryList, read } from 'biz/services/notice';

import { PAGE_SIZE } from 'common/global/constant';
import { effectsCreate, reducers } from 'biz/models/modelCreator';
import permission from 'common/permission';

import { PublishStatus } from 'common/global/enum';

const moduleName = 'noticeList';
const PATH = '/notice/list';
const AUTHS = ['XSBN_ARTICLE_ALL'];

let defaultState = {
  list: null,
  crumbList: [
    { name: '政策发布', key: 'notice' },
  ],
  actionAuths: {},
  searchParams: {
    pageNo: 1,
    pageSize: 10
  },
  isSearch: false,
  categoryList: [],
  previewData: {},
  showPreviewModal: false,
  showForm: false,
  targetId: null
};

export default {
  namespace: moduleName,
  state: {
    moduleName: moduleName,
    auths: AUTHS,
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
    * getData({ payload, }, { call, put, select }) {
      if (!permission.isAllow(AUTHS)) {
        yield put({ type: 'updateAuth', payload: false });
        return false;
      }

      yield put({ type: 'updateAuth', payload: true });

      const categoryListRes = yield call(getCategoryList);

      if (categoryListRes.globalError) {
        message.error('加载栏目列表失败：' + categoryListRes.globalError);
      }
      else {
          yield put({ type: 'initCategoryLiist', payload: categoryListRes.data });
      }

      yield put({ type: 'list' });
    },

    * list({ payload, }, { call, put, select }) {
      const model = yield select(state => state[moduleName]);
      let searchParams  = { ...model.searchParams };
      let { publishStatus, range, keyType } = searchParams;
      if (range) {
        let { startDate, endDate } = range;
        searchParams.startTime = startDate.format('YYYY-MM-DD hh:mm:ss');
        searchParams.endTime = endDate.format('YYYY-MM-DD hh:mm:ss');
        searchParams = _.omit(searchParams, 'range');
      }

      if (publishStatus === '-1') {
        searchParams = _.omit(searchParams, 'publishStatus');
      }
      if (keyType === '-1') {
        searchParams = _.omit(searchParams, 'keyType');
      }

      yield put({ type: 'resetList' });
      const response = yield call(list, searchParams);

      yield put({
        type: 'handleResponse',
        payload: { response, callback: 'loadListSuccess', extra: { response } }
      });
    },

    * loadListSuccess({ payload, }, { call, put, select }) {
      const { response } = payload.extra;
      const { data } = response;
      yield put({ type: 'formatList', payload: data });
    },

    * delete({ payload, }, { put, call }) {
      const id = payload;
      const { data, globalError } = yield call(remove, id);
      if (globalError) {
        message.error(globalError);
      }
      else {
        message.success('已删除!');
        yield put({ type: 'deleteSuccess', payload: id });
      }
    },

    * offline({ payload, }, { put, call }) {
      const id = payload;
      const { data, globalError } = yield call(offline, id);
      if (globalError) {
        message.error(globalError);
      }
      else {
        message.success('已下架!');
        yield put({ type: 'updatePublishStatus', payload: { id, publishStatus: PublishStatus.getTextFromAlias('DRAFT') }});
      }
    },

    * publish({ payload, }, { put, call }) {
      const id = payload;
      const { data, globalError } = yield call(publish, id);
      if (globalError) {
        message.error(globalError);
      }
      else {
        message.success('已发布!');
        yield put({ type: 'updatePublishStatus', payload: { id, publishStatus: PublishStatus.getTextFromAlias('PUBLISHED') }});
      }
    },

    * preview({ payload, }, { put, call }) {
      const { globalError, data } = yield call(read, payload);
      if (!globalError) {
        yield put({ type: 'toPreview', payload: data });
      }
      else {
        message.error('加载资讯信息失败：' + globalError);
      }
    }

  },
  reducers: {
    ...reducers,
    formatList(state, action) {
      let { aArticleList, total } = action.payload;
      let list = aArticleList.map((item, index) => ({
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

    initCategoryLiist(state, action) {
      let categoryList = [...action.payload];
      categoryList = categoryList.map(({ id, name }) => ({id, text: name }));

      return {
        ...state,
        categoryList
      };
    },

    deleteSuccess(state, action) {
      let id = action.payload;
      let list = [...state.list];
      let index = list.findIndex(item => item.id === id);

      if (index !== -1) {
        list.splice(index, 1);
      }

      return {
        ...state,
        list,
      };
    },

    updatePublishStatus(state, action) {
      let { id, publishStatus } = action.payload;
      let list = state.list.map(item => {
        if (item.id === id) {
          return {
            ...item,
            publishStatus
          };
        }

        return {
          ...item
        };
      });

      return {
        ...state,
        list,
      };
    },

    toPreview(state, action) {
      let previewData = action.payload;
      return {
        ...state,
        previewData,
        showPreviewModal: true,
      }
    },

    closePreview(state, action) {
      return {
        ...state,
        previewData: {},
        showPreviewModal: false
      }
    }
  },
}
