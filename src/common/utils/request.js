const Ajax = require('axios');
import { message } from 'antd';
import _ from 'underscore';
import { routerRedux } from 'dva/router'

const delayCloseTime = 5;
export const prefix = '/manage';

const info = function (error, text) {
  message.error(
    error && error.response && error.response.data && error.response.data.msg || text || '服务器错误',
    delayCloseTime,
  );
};

const httpStatus = {
  403: error => {
    if (error && error.response && error.response.data) {
      const data = error.response.data;
      if (data.msg) {
        info(error);
      }
      else {
        info(error, '权限错误');
      }
    }
    else {
      info(error, '权限错误');
    }
    // window.location.href = '/unauth';
  },
  401: error => {
    window.location.href = '/logon';
  },
  500: error => {
    window.location.href = '/systemError'
  },
  502: error => {
    window.location.href = '/systemError'
  },
  504: error => {
    window.location.href = '/systemError'
  },
};

function errorHandle(error) {
  const code = error && error.response && error.response.status;
  if (code && httpStatus[code]) {
    httpStatus[error.response.status](error);
  }
  else {
    info(error, '服务器错误');
  }
  return {success: false};
}

export function request(url, options) {
  if ((options.method === 'GET' || !options.method) && options.data) {
    options.params = options.data;
    options.data = null;
  }

  if ((options.method === 'POST' || options.method === 'PUT') && !options.data && options.params) {
    options.data = options.params;
    options.params = null;
  }

  return Ajax({
    method: options.method || 'GET',
    url: prefix + url,
    data: options.data || {},
    params: options.params || {},
  }).then(
    ({data}) => {
      if (data.success) {
        return { data: data.data, success: true };
      }
      else {
        let resp = {};
        if (data.msg) {
          resp.globalError = data.msg;
        }
        if (data.fieldErrors) {
          resp.fieldErrors = data.fieldErrors;
        }
        return { ...resp, success: false };
      }
    }
  ).catch((error) => { return errorHandle(error); });
};

export function upload(url, data) {
  var form = new FormData(); // FormData 对象
  _.each(
    data,
    (value, key) => {
      form.append(key, value);
    }
  );
  return Ajax.post(
    prefix + url,
    form,
    {
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(response => ({ data: response.data || '' }))
    .catch((error) => {
      return errorHandle(error);
    }
  );
}
