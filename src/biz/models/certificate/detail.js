import { message, Modal } from 'antd';
import _ from 'underscore';

import { effectsCreate, reducers } from 'biz/models/modelCreator';
import { pass, deny, read, setCrpstatus, setmedia, singleDeny, verify, frameVerify } from 'biz/services/certificate';

import { AuditStatus } from 'common/global/enum';
import permission from 'common/permission';

const moduleName = 'certificateDetail';
const AUTHS = [];

export default {
  namespace: moduleName,
  state: {
    moduleName: moduleName,
    crumbList: [
      { name: '房源审核', key: 'index' },
      { name: '审核详情', key: 'action' },
    ],
    auths: AUTHS,
    id: null,
    reasonInput: '',
    showDenyReason: false,
    entity: {}
  },
  effects: {
    ...effectsCreate(),
    * getData({ payload, }, { call, put, select }) {
      if (!permission.isAllow(AUTHS)) {
        return false;
      }

      yield put({type: 'resetAndParseUrl', payload: { query: { id: payload }}});

      let { id } = yield select(state => state[moduleName]);

      if (id) {
        const { success, data, globalError } = yield call(read, id);
        if (success) {
          yield put({ type: 'initEntity', payload: { ...data } });
        }
        else {
          message.error(`获取审核信息失败：${globalError}`);
        }
      }
      else {
        message.error('参数错误');
      }
    },

    * toggleValid({ payload, }, { call, put, select }) {
      const { entity, id } = yield select(state => state[moduleName]);
      const houseId = id;
      const mediaId = payload.id;
      const type = payload.type;

      // 找到图片
      const targetPic = entity[type].pics.find(item => item.id === mediaId);
      let showStatus = targetPic.showStatus == 1 ? 0 : 1;

      const { data, globalError } = yield call(setmedia, { houseId, mediaId, showStatus });

      if (data) {
        message.success('修改可见完成！');
        yield put({type: 'updateValidStatus', payload: { mediaId, showStatus, type }});
      }
      else {
        message.error(`${globalError}`);
      }
    },

    * verify({ payload, }, { call, put, select }) {
      const model = yield select(state => state[moduleName]);
      const { id }  = model;

      const { data, globalError } = yield call(verify, id);

      if (data) {
        message.success('产权验真完成！');
        yield put({type: 'updateValidateStatus', payload: data});
      }
      else {
        message.error(`${globalError}`);
      }
    },

    * frameVerify({ payload, }, { call, put, select }) {
      const model = yield select(state => state[moduleName]);
      const { id }  = model;

      const { data, globalError } = yield call(frameVerify, id);

      if (data) {
        message.success('框架验真完成！');
        yield put({type: 'updateFrameValidateStatus', payload: data});
      }
      else {
        message.error(`${globalError}`);
      }
    },

    * pass({ payload, }, { call, put, select }) {
      const model = yield select(state => state[moduleName]);
      const { id }  = model;
      const { data, globalError } = yield call(pass, id);

      if (data) {
        message.success('审核通过完成！');
        yield put(routerRedux.push('/index/housing/certificate/list'));
      }
      else {
        message.error(`${globalError}`);
      }
    },

    * deny({ payload, }, { call, put, select }) {
      const model = yield select(state => state[moduleName]);
      const { id, reason, reasonInput, singleDenyId }  = model;

      if (!reason || reason === '') {
        message.error('请选择驳回理由！');
        return false;
      }

      if (!reasonInput || reasonInput === '') {
        message.error('请输入驳回理由！');
        return false;
      }

      let response;

      if (singleDenyId) {
        response = yield call(singleDeny, { id: singleDenyId, houseId: id, reason, reasonInput });
      }
      else {
        response = yield call(deny, { id, reason, reasonInput });
      }

      if (response.data) {
        message.success('审核驳回完成！');
        yield put({type: 'cancelDeny'});

        if (singleDenyId) {
           yield put({
            type: 'updateSingleDenyStatus',
            payload: {
              id: singleDenyId,
              rejectReason: dynamicConst.getTextFromValue('reasonsForRejection', reason),
              rejectReasonCustom: reasonInput
            }
          });
        }
        else {
          yield put(routerRedux.push(`/index/housing/certificate/list`));
        }
      }
      else {
        message.error('审核驳回失败: ' + response.globalError);
      }
    },

    * setCrpstatus({ payload, }, { put, call, select }) {
      const id = yield select(state => state[moduleName]['id']);
      const { data, globalError } = yield call(setCrpstatus, id, payload);
      if (globalError) {
        message.error(globalError);
      }
      else {
        message.success('修改完成!');
        yield put({
          type: 'updateCrpstatus',
          payload
        });
      }
    },
  },

  reducers: {
    ...reducers,
    syncReason(state, action) {
      return {
        ...state,
        reason: action.payload
      };
    },

    syncReasonInput(state, action) {
      return {
        ...state,
        reasonInput: action.payload
      };
    },

    toDeny(state, action) {
      return {
        ...state,
        singleDenyId: null,
        showDenyReason: true,
        reason: null,
        reasonInput: ''
      };
    },

    toSingleDeny(state, action) {
      return {
        ...state,
        singleDenyId: action.payload,
        showDenyReason: true,
        reason: null,
        reasonInput: ''
      };
    },

    cancelDeny(state, action) {
      return {
        ...state,
        showDenyReason: false,
        reason: null,
        reasonInput: ''
      };
    },

    updateValidateStatus(state, action) {
      let { propertyRightNo, govVerify, govVerifyName } = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          verifyInfo: {
            ...state.entity.verifyInfo,
            propertyRightNo,
            govVerification: govVerify ? 1 : -1,
            govVerificationName: govVerify ? '已通过' : '未通过'
          }
        }
      };
    },

    updateFrameValidateStatus(state, action) {
      let { hfVerify, hfVerifyName } = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          verifyInfo: {
            ...state.entity.verifyInfo,
            hfVerification: hfVerify == 1 ? 1 : -1,
            hfVerificationName: hfVerify == 1 ? '已通过' : '未通过'
          }
        }
      };
    },

    updateValidStatus(state, action) {
      let { mediaId, showStatus, type } = action.payload;
      let { entity } = state;
      let { pics } = entity[type];
      let index = pics.findIndex(item => item.id === mediaId);
      pics[index].showStatus = showStatus;
      return {
        ...state,
        entity: {
          ...state.entity,
          housingInfo: {
            ...state.entity.housingInfo,
            pics
          }
        }
      };
    },

    updateSingleDenyStatus(state, action) {
      let { id, rejectReason, rejectReasonCustom } = action.payload;
      let { roomList } = state.entity;
      let index = roomList.findIndex(item => item.id === id);
      roomList[index].auditStatus = AuditStatus.getValueFromAlias('FAIL');
      roomList[index].rejectReason = rejectReason;
      roomList[index].rejectReasonCustom = rejectReasonCustom;
      return {
        ...state,
        entity: {
          ...state.entity,
          roomList
        }
      };
    }
  },
}
