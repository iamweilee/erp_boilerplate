import { request } from 'common/utils';
import buildService from 'biz/services/buildService';

let baseService = buildService('account');

export default {
  ...baseService,

  async frozen(id) {
    return request(`${baseService.requestHost}/frozen/${id}`, { method: 'PUT' });
  },

  async unfrozen(id) {
    return request(`${baseService.requestHost}/unfrozen/${id}`, { method: 'PUT' });
  },

  async resetPassword({ data, id }) {
    return request(`${baseService.requestHost}/resetPassword/${id}`, { method: 'PUT', data });
  }
}
