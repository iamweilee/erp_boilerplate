import { message } from 'antd';
import _ from 'underscore';

import { effectsCreate, reducers } from 'biz/models/modelCreator';
import { list } from 'biz/services/certificate';

import { PAGE_SIZE } from 'common/global/constant';

import { omitNullParam } from 'common/utils/transform'
import { AuditStatus } from 'common/global/enum';

const moduleName = 'certificateList';
const PATH = 'certificate/list';
const AUTHS = [];

let defaultState = {
  showDetail: false,
  isSearch: false,  // 必须设置
  targetId: null,  // 必须设置
  list: null,  // 必须设置
  total:0,  // 分页时必须设置
  searchParams: {
    pageSize: PAGE_SIZE, // 分页时必须设置
    pageNo: 1, // 分页时必须设置
    keyword: '',
    auditStatus: '', /* 账号主体 */
  },
  crumbList: [
    { name: '房源审核', key: 'index' }
  ],  // 面包屑初始值
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
    * getData({ payload, }, { call, put, select }) {
      yield put({ type: 'list' });
    },

    * list({ payload, }, { call, put, select }) {
      yield put({ type: 'resetList' });

      const model = yield select(state => state[moduleName]);
      let searchParams  = { ...model.searchParams };
      searchParams = omitNullParam(omitNullParam, ['channel', 'auditStatus', 'type', 'roomNum']);

      const reg = /^-?([1-9][0-9]*)(\.[0-9]*)?$/;
      const roomNum = searchParams.roomNum;
      if (roomNum) {
        if (roomNum === '') {
          searchParams = _.omit(searchParams, 'roomNum');
        }
        else if (!reg.test(roomNum)) {
          message.error('请输入正确的室数，最小室数不能小于1。');
          return false;
        }
      }
      else {
          searchParams = _.omit(searchParams, 'roomNum');
      }

      if (searchParams.region) {
        searchParams = { ...searchParams, ...searchParams.region };
        searchParams = _.omit(searchParams, 'region');
      }

      const response = yield call(list, searchParams);

      yield put({
        type: 'handleResponse',
        payload: { response, callback: 'loadListSuccess', extra: { response } }
      });
    },

    * batchPass({ payload, }, { call, put, select }) {
      let text = payload.map(item => item.id).join(',');
      message.info(`批量通过${text}`);
      yield put({ type: 'list' });
    }
  },
  reducers: {
    ...reducers
  },
}
