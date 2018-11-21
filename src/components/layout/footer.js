/**
 * 页脚
 */
import { connect } from 'dva';
import React, { PropTypes } from 'react';

class Footer extends React.Component {

  render = () => {
    return (
      <div className={'account-footer ' + (this.props.className || '')}>
        <p><i className="iconfont icon-ServiceTel"></i>服务热线&nbsp;400-868-1111&nbsp;&nbsp;&nbsp;&nbsp;沪ICP备案&nbsp;14012051号&nbsp;&nbsp;版权所有&nbsp;&#9400;&nbsp;
          平安好房</p>
      </div>
    )
  }
}

export default Footer
