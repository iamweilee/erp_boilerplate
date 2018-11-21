import { request } from 'common/utils';
import buildService from 'biz/services/buildService';

let baseService = buildService('certificate');

export default {
  ...baseService,
  async pass(id) {
    return request(baseService.requestHost + '/approve/' + id, { method: 'POST' });
  },

  async deny(data) {
    let { id, reason } = data;
    return request(baseService.requestHost + '/reject/' + id, { method: 'POST', data: { rejectReason: reason } });
  },

  async getRejectReason(id) {
    return request(baseService.requestHost + '/reject/' + id, { method: 'GET' });
  },


  async pass(id) {
    return request(baseService.requestHost + '/audit/' + id, { method: 'POST', data: {auditStatus: 1 }});
  },

  async singleDeny(data) {
    let { id, houseId, reason, reasonInput } = data;
    return request(baseService.requestHost + '/room/audit/' + id, { method: 'PUT', data: { houseId, rejection: reason, rejectionCustom: reasonInput, auditStatus: 2 } });
  },

  async setCrpstatus(id, crpStatus) {
    return request(baseService.requestHost + '/crpstatus/' + id, { method: 'PUT', data: { crpStatus } });
  },

  async setmedia(data) {
    return request(baseService.requestHost + '/setmedia', { method: 'PUT', data });
  },

  async verify(id) {
    return request(
      baseService.requestHost + '/verify/' + id,
      {
        method: 'GET'
      }
    );
  },

  async frameVerify(id) {
    return request(
      baseService.requestHost + '/verify/' + id + '/2',
      {
        method: 'GET'
      }
    );
  }
}
