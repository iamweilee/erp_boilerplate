import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import _ from 'underscore';

import './drawerModal.less';

function getInnerValue(key, fields) {
  let splitKeys = key.split('.');
  return splitKeys.reduce(
    (value, key) => {
      return value[key];
    },
    fields
  );
}

const DrawerModal = (Wrapper) => {
  class WrapperComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        key: +new Date(),
      };
    }

    render() {
      return (
        <Modal
          key={ this.state.key }
          visible={ this.props.visible }
          onCancel={ this.props.onCancel }
          footer={ false }
          wrapClassName="drawer-modal-wrap"
          maskClosable={ false }
          destroyOnClose={ true }
        >
          <Wrapper {...this.props}/>
        </Modal>
      );
    }
  }

  return WrapperComponent;
};

export default DrawerModal;
