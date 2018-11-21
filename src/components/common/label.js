import { Col, Row } from 'antd';
import React, { PropTypes } from 'react';
import { Link } from 'dva/router';
import Image from 'components/common/image';
import { transform } from 'common/utils';
import dynamicConst from 'common/dynamicConst';
import _ from 'underscore';
import './label.less';

function Label(props) {
  let { title, value, enumInstance, constKey, type, width, height, mapKey, mapValue, children } = props;
  let element = value;
  if (type === 'arrayEnum') {
    if (!value || !value.length) {
      element = <span>-</span>;
    }
    else {
      let text = value.map(item => enumInstance.getTextFromValue(item));
      element = <span>{ text.join('、') }</span>
    }
  }
  else if (type === 'dynamicConst') {
    if (!value || !value.length) {
      element = <span>-</span>;
    }
    else {
      let text = value.map(item => dynamicConst.getTextFromValue(constKey, item));
      element = <span>{ text.join('、') }</span>
    }
  }
  else if (type === 'image') {
    if (!value || !value.length) {
      element = <span>-</span>;
    }
    else {
      value = transform.formatImages(value);
      element = value.map((item, index) => <Image
        showStatus = {item.showStatus}
        id={item.id} src={ item.thumbUrl } fullSrc={ item.url } width={ width } height={ height }
        key={index + new Date().getTime()} />);
    }
  }
  else if (type === 'textEnum') {
    let text = enumInstance.getTextFromValue(value);
    element = <span>{ text }</span>
  }
  else if (type === 'money') {
    let text = transform.formateMoney(value) + '元';
    element = <span>{ text }</span>
  }
  else if (type === 'space') {
    let text = value / 100;
    element = <span>{ text }m<sup>2</sup></span>
  }

  else if (type === 'textLine') {
    const text = _.map(value, item => {
      const text = dynamicConst.getTextFromValue(constKey, item[mapKey]) + transform.formateMoney(item[mapValue]) + '元';
      return (<div>{text}</div>);
    });
    element = text;
  }
  else if (type === 'richText') {
    element = <div className="rich-text-wrapper" dangerouslySetInnerHTML={{__html: value}}></div>
  }
  return (
    <Row className="app-label">
      <Col span={3} className="app-label-title">{ title }</Col>
      <Col span={18} className="app-label-content">{ element } { children || '' }</Col>
    </Row>
  );
}

Label.propTypes = {};

export default Label;
