import { routerRedux } from 'dva/router'
import _ from 'underscore';

import { edit, create, read, getCategoryList } from 'biz/services/notice';
import { effectsCreate, reducers } from 'biz/models/modelCreator';

import permission from 'common/permission';
import { transform } from 'common/utils';
import { IMAGE_THUMB_SIZE, IMAGE_COMMON_SIZE, VIEW_URL } from 'common/global/constant';
import { message } from 'antd';

const moduleName = 'noticeEdit';
const PATH = 'notice/edit';
const AUTHS = ['XSBN_ARTICLE'];

let defaultState = {
  crumbList: [
    { name: '新增政策', key: 'action' },
  ],
  categoryList: [],
  id: null,
  entity: {},
  previewData: {},
  fieldErrors: {},
  showPreviewModal: false
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
        yield put({ type: 'resetAndParseUrl', payload: {query: { id: payload }}});
        yield put({ type: 'initRelatedData', payload });

        const categoryListRes = yield call(getCategoryList);
        if (categoryListRes.success) {
          yield put({ type: 'initCategoryLiist', payload: categoryListRes.data });
        }
        else {
          message.error('加载栏目列表失败：' + categoryListRes.globalError);
        }
        const id  = payload;
        if (id) {
          const { data, globalError, success } = yield call(read, id);
          if (success) {
            yield put({ type: 'initEntity', payload: data });
          }
          else if (globalError) {
            message.error(globalError);
          }
        }
    },
    * innerSave({ payload, }, { call, put, select }) {
      let { id, content } = yield select(state => state[moduleName]);
      let { value, successHandler } = payload;
      let params = { ...value, content };

      if (params.publishedAt) {
        if ((params.publishedAt.valueOf() > Date.now())) {
          message.error('不能选择未来时间');
          return false;
        }
        params.publishedAt = params.publishedAt.format('YYYY-MM-DD HH:mm:ss');
      }
      else {
        params = _.omit(params, 'publishedAt');
      }

      if (params.icon && params.icon.length) {
        let images = transform.formatRequestImages(params.icon);
        params.picKey = images[0].imgKey;
        params.picExt = images[0].imgExt;
        params = _.omit(params, 'icon');
      }

      if (!params.content) {
        message.error('正文不能为空');
        return false;
      }

      let successMessage;
      let response = yield call(edit, { data: params, id });
      if (id) {
        successMessage = '编辑成功';
      }
      else {
        successMessage = '添加成功';
      }

      yield put({
        type: 'handleResponse',
        payload: { response, callback: 'innerSaveSuccess', extra: { successMessage, response, successHandler } }
      });
    }
  },
  reducers: {
    ...reducers,
    changeContent(state, action) {
      return {
        ...state,
        content: action.payload
      };
    },
    initRelatedData(state, action) {
      let id = action.payload;
      let crumbList = [];
      if (id) {
        return {
          ...state,
          crumbList: [{ name: '修改文章', key: 'edit' }]
        }
      }
      else {
        return {
          ...state,
          crumbList: [{ name: '新建文章', key: 'edit' }]
        }
      }
    },
    initEntity(state, action) {
      let { icon } = action.payload;
      let infos = icon.split('|');
      let icons = infos.length > 1 ? [{
        status: 'done',
        thumbUrl: `${VIEW_URL}/${infos[0]}/${IMAGE_THUMB_SIZE}.${infos[1]}`,
        url: `${VIEW_URL}/${infos[0]}/${IMAGE_COMMON_SIZE}.${infos[1]}`,
        response: {
          file: { sExt: infos[1], sKey: infos[0] }
        }
      }] : [];

      return {
        ...state,
        entity: {
          ...action.payload,
          icon: icons
        }
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
    preview(state, action) {
      let previewData = action.payload;
      previewData.publishedAt = previewData.publishedAt.format('YYYY-MM-DD');
      return {
        ...state,
        previewData,
        showPreviewModal: true,
      }
    },

    closePreview(state, action) {
      return {
        ...state,
        showPreviewModal: false
      }
    }
  },
}
