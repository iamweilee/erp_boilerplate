import { request } from 'common/utils';
import buildService from 'biz/services/buildService';

let baseService = buildService('statistics');

export default {
  ...baseService
}
