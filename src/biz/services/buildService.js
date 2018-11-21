import { request } from 'common/utils';
import u from 'underscore';

const buildService = (entityName) => {
  let requestHost = '/' + entityName;

  return {
    requestHost,
    async list(params) {
      return request(
        requestHost,
        {
          method: 'GET',
          params,
        }
      );
    },

    async create(data) {
      return request(
        requestHost,
        {
          method: 'POST',
          data,
        }
      );
    },

    async update({ data, id }) {
      return request(
        requestHost + '/' + id,
        {
          method: 'PUT',
          data,
        }
      );
    },

    async remove(id) {
      return request(
        requestHost + '/' + id,
        {
          method: 'DELETE'
        }
      );
    },

    async read(id) {
      return request(
        requestHost + '/' + id,
        {
          method: 'GET'
        }
      );
    }
  }
}

export default buildService;
