import { request } from 'common/utils';
import buildService from 'biz/services/buildService';

let baseService = buildService('company');

// ‘/api/company' GET POST PUT DELETE

export default {
  ...baseService,

  async companyList(id) {
    return request(baseService.requestHost + '/dropDownList', { method: 'GET' });
  }
}
