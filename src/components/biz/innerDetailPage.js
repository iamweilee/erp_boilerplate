/**
 * 内嵌编辑页视图基类
 */
import React, { PropTypes } from 'react';

import { Container } from 'components/layout';

import "./detail.less";

class InnerDetailPage extends React.Component {

  componentWillMount = () => {
    this.props.dispatch({
      type: `${this.module}/getData`,
      payload: this.props.targetId
    });
  }

  render = () => {
    return (<div></div>);
  }
}

export default InnerDetailPage;
