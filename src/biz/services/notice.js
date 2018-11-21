import { request } from 'common/utils';
import buildService from 'biz/services/buildService';

let baseService = buildService('article');

export default {
  ...baseService,
  async list(params) {
    return request(
      baseService.requestHost + '/list',
      {
        method: 'GET',
        params,
      }
    );
  },
  async remove(id) {
    return request(
      baseService.requestHost + '/delete/' + id,
      {
        method: 'DELETE'
      }
    );
  },


  async edit({data, id}) {
   if (id) {
    return request(
      baseService.requestHost + '/edit/' + id,
      {
        method: 'PUT',
        data,
      }
    );
    }

    return request(
      baseService.requestHost + '/edit/0',
      {
        method: 'POST',
        data,
      }
    );
  },

  async read(id) {
    return request(
      baseService.requestHost + '/preview/' + id,
      {
        method: 'GET'
      }
    );
  },

  async offline(id) {
    return request(
      baseService.requestHost + '/soldOut/' + id,
      {
        method: 'PUT'
      }
    );
  },

  async publish(id) {
    return request(
      baseService.requestHost + '/publish/' + id,
      {
        method: 'PUT'
      }
    );
  },

  async getCategoryList() {
    return request(
      baseService.requestHost + '/getCategoryList',
      {
        method: 'GET'
      }
    );
  }
}
