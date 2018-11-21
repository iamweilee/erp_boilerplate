import React, { PropTypes } from 'react';
import { Select, Form, Input, Button, Icon } from 'antd';
import moment from 'moment';
import _ from 'underscore';

import { IMAGE_THUMB_SIZE, IMAGE_COMMON_SIZE } from 'common/global/constant';
import dynamicConst from 'common/dynamicConst';


const Option = Select.Option;
const FormItem = Form.Item;

export default {

  queryURL(name) {
    let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) return decodeURIComponent(r[2])
    return null
  },

  searchToQuery(url) {
    if (url.indexOf('?') !== -1) {
      let str = url.substr(1);
      let strs = str.split('&');
      return strs.reduce(
        (query, item) => {
          let pairs = item.split('=');
          query[pairs[0]] = pairs[1];
          return query;
        },
        {}
      );
    }

    return {};
  },

  getDate(time, type = 'YYYY.MM.DD') {
    const date = moment(parseInt(time, 10));
    return date.isValid() ? date.format(type) : '';
  },

  getToday() {
    let days = ['日', '一', '二', '三', '四', '五', '六'];
    const momentDate = moment(new Date());
    const date = momentDate.format('YYYY.MM.DD');
    const day = '星期' + days[momentDate.day()];
    const hours = momentDate.hour();
    const minutes = momentDate.minute();
    const meridiem = this.getMeridiem(hours, minutes);
    return { date, day, meridiem };
  },

  getMeridiem(hour, minute) {
    var hm = hour * 100 + minute;
    if (hm < 600) {
      return "凌晨";
    } else if (hm < 900) {
        return "早上";
    } else if (hm < 1130) {
        return "上午";
    } else if (hm < 1230) {
        return "中午";
    } else if (hm < 1800) {
        return "下午";
    } else {
        return "晚上";
    }
  },

  addKey(arr) {
    return arr.map((item, key) => ({ ...item, key: key + new Date().getTime() }));
  },

  // 分转元
  formateMoney(value, type=2) {
    if (!value) {
      return 0;
    }
    return (value/100).toFixed(type);
  },

  // 元转分
  formateFen(value) {
    if (!value) {
      return 0;
    }
    return value * 100;
  },

  fromNumberToString(value) {
    if (value === 0 || value) {
      return '' + value;
    }

    return undefined;
  },

  objectToHashString(obj) {
    let str = '?';
    if (!obj) {
      return str;
    }
    for (const key in obj) {
      if (obj[key]) {
        str += `${key}=${obj[key]}&`;
      }
    }
    return str;
  },

  selectOptions(constantsTypes, fieldOp) {
    fieldOp = fieldOp || { key: 'id', value: 'text' };
    // {key: 'xxxx', value: 'xxxx'}
    if (!_.isArray(constantsTypes)) {
        let options = [];
        _.each(
          constantsTypes,
          (value, key) => {
            let trueValue;
            let disabled = false;
            if (_.isObject(value)) {
              trueValue = value.value;
              disabled = value.disabled;
            }
            else {
              trueValue = value;
            }
            return options.push(<Option key={key} value={key} disabled={disabled}>{ trueValue }</Option>)
          }
        );
        return options;
    }
    // [{key: 'xxxx', value: 'xxxx'}]
    // [1, 3, 4]
    return constantsTypes.reduce(
      (options, value, key) => {
          let realKey;
          let display;
          if (_.isObject(value)) {
            realKey = '' + value[fieldOp.key];
            display = value[fieldOp.value];
          }
          else {
            realKey = '' + key;
            display = value;
          }

          options.push(<Option key={ realKey } value={ realKey }>{ display }</Option>);
          return options;
      },
      []
    );
  },

  radioOptions(constantsTypes, fieldOp) {
    if (!_.isArray(constantsTypes)) {
        let options = [];
        _.each(
          constantsTypes,
          (value, key) => {
             return options.push({ label: value, value: key });
          }
        );
        return options;
    }
    return constantsTypes.reduce(
      (options, value, key) => {
          let realKey;
          let display;
          if (fieldOp) {
            realKey = value[fieldOp.key];
            display = value[fieldOp.value];
          }
          else {
            realKey = key;
            display = value;
          }

          options.push({ label: value, value: realKey });
          return options;
      },
      []
    );
  },

  fieldsToParams(fields, dateType='YYYY-MM-DD') {
    const params = {};
    const keys = Object.keys(fields);
    let i = keys.length - 1;

    while (i >= 0) {
      const key = keys[i];
      if (fields[key] instanceof moment) {
        params[key] = fields[key].format(dateType);
      } else {
        params[key] = fields[key];
      }
      i--;
    }

    return params;
  },

  createPageConfig(model, query) {
    if (model.total <= model.searchParams.pageSize) {
      return false;
    }
    return {
      pageSize: model.searchParams.pageSize,
      total: model.total,
      current: model.searchParams.pageNo,
      onChange(page, pageSize) {
        const params = {
          ...model.searchParams,
          pageNo: page,
          pageSize,
        };
        query(params);
      },
    };
  },

  formatJson(json, options) {
    var reg = null,
      formatted = '',
      pad = 0,
      PADDING = '    '; // one can also use '\t' or a different number of spaces

    // optional settings
    options = options || {};
    // remove newline where '{' or '[' follows ':'
    options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
    // use a space after a colon
    options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;

    // begin formatting...
    if (typeof json !== 'string') {
      // make sure we start with the JSON as a string
      json = JSON.stringify(json);
    } else {
      // is already a string, so parse and re-stringify in order to remove extra whitespace
      json = JSON.parse(json);
      json = JSON.stringify(json);
    }

    // add newline before and after curly braces
    reg = /([\{\}])/g;
    json = json.replace(reg, '\r\n$1\r\n');

    // add newline before and after square brackets
    reg = /([\[\]])/g;
    json = json.replace(reg, '\r\n$1\r\n');

    // add newline after comma
    reg = /(\,)/g;
    json = json.replace(reg, '$1\r\n');

    // remove multiple newlines
    reg = /(\r\n\r\n)/g;
    json = json.replace(reg, '\r\n');

    // remove newlines before commas
    reg = /\r\n\,/g;
    json = json.replace(reg, ',');

    // optional formatting...
    if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
      reg = /\:\r\n\{/g;
      json = json.replace(reg, ':{');
      reg = /\:\r\n\[/g;
      json = json.replace(reg, ':[');
    }
    if (options.spaceAfterColon) {
      reg = /\:/g;
      json = json.replace(reg, ':');
    }

    json.split('\r\n').forEach(function(node, index) {
      var i = 0,
        indent = 0,
        padding = '';

      if (node.match(/\{$/) || node.match(/\[$/)) {
        indent = 1;
      } else if (node.match(/\}/) || node.match(/\]/)) {
        if (pad !== 0) {
          pad -= 1;
        }
      } else {
        indent = 0;
      }

      for (i = 0; i < pad; i++) {
        padding += PADDING;
      }

      formatted += padding + node + '\r\n';
      pad += indent;
    });

    return formatted;
  },

  formatList(list) {
    return list.map(
      (item, index) => ({
        ...item,
        key: index + new Date().getTime(),
        antOrderNumber: index + 1,
      }),
    );
  },

  fromNumberToArray(length, withZero) {
    return Array.from({ length }, (value, index) => withZero ? index : index + 1);
  },

  formatImages(files, type) {
    files = files || [];
    let viewUrl = dynamicConst.getItem('viewUrl');
    return files.map((item) => {
      let thumbUrl;
      let url;
      if (type === 'secret') {
        thumbUrl = `${viewUrl}/${item.imgKey}.${item.imgExt}`;
        url = `${viewUrl}/${item.imgKey}.${item.imgExt}`;
      }
      else {
        thumbUrl = `${viewUrl}/${item.imgKey}/${IMAGE_THUMB_SIZE}.${item.imgExt}`;
        url = `${viewUrl}/${item.imgKey}/${IMAGE_COMMON_SIZE}.${item.imgExt}`;
      }
      return {
        ...item,
        uid: item.id,
        name: item.id,
        status: 'done',
        thumbUrl,
        url,
        response: {
          file: {
            sExt: item.imgExt,
            sKey: item.imgKey
          }
        }
      }
    });
  },

  // 图片response处理
  formatRequestImages(pics, noNeedStringify) {
    pics = pics || [];
    let result = pics.map(pic => {
      let file = pic.response.file;
      let basicInfo = {
        imgExt: file.sExt,
        imgKey: file.sKey,
        isCover: pic.isCover
      }
      if (pic.id) {
        basicInfo.id = pic.id;
      }
      return basicInfo;
    });

    let coverPic = result.find(pic => pic.isCover);

    // 没有设置封面，则默认第一张为封面
    if (!coverPic && result[0]) {
      result[0].isCover = true;
    }

    return result;
  },

  addDataAll(arr={}) {
    return {
      ...arr,
      0: '全部',
    };
  },

  omitNullParam(params, filteredFields) {
    let cloneParams = { ...params };
    filteredFields.forEach(key => {
      if (cloneParams[key] === '-1') {
        cloneParams = _.omit(cloneParams, key);
      }
    });
    return cloneParams;
  },

  // antd的选择型组件只认字符串，这里做个统一转化的方法
  stringyValue(source, field) {
    return (source || []).map(item => ({ ...item, [field]: '' + item[field]}))
  },

  rowClassName(record, index) {
    // 奇数行
    if (index % 2 === 0) {
      return 'table-row-odd';
    }

    return 'table-row-even';
  },

};
