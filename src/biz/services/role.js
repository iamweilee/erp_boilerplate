import { request } from 'common/utils';
import buildService from 'biz/services/buildService';

let baseService = buildService('role');

export default {
  ...baseService,

  async roleList(id) {
    return request(baseService.requestHost + '/dropDownList', { method: 'GET' });
  }
}
