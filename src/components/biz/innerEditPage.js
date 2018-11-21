/**
 * 内嵌编辑页视图基类
 */
import React, { PropTypes } from 'react';
import { Modal } from 'antd';

import { Container } from 'components/layout';

import "./edit.less";

const confirm = Modal.confirm;

class InnerEditPage extends React.Component {

  componentWillMount = () => {
    this.props.dispatch({
      type: `${this.module}/getData`,
      payload: this.props.targetId
    });
  }

  save = (fieldsValue) => {
    this.props.dispatch({
      type: `${this.module}/innerSave`,
      payload: {
        value: fieldsValue,
        successHandler: () => {
          this.props.dispatch({
            type: `${this.module}/resetAndParseUrl`,
            payload: { query: { id: null }}
          });
          this.props.onSaveSuccess();
        }
      }
    });
  }

  cancel = () => {
    confirm({
      title: '确认退出编辑么?',
      content: '点击确认，所填信息将失效！',
      onOk: () => {
        this.props.dispatch({
          type: `${this.module}/resetAndParseUrl`,
          payload: { query: { id: null }}
        });
        this.props.onCancel();
      },
      onCancel() {},
    });
  }

  render = () => {
    const { crumbList, entity, fieldErrors } = this.props[this.module];
    const containerProps = { crumbList, containerClass: 'edit-page' };
    const formProps = {
      fromType: this.props.fromType,
      onSubmit: this.save,
      onCancel: this.cancel,
      entity,
      fieldErrors
    };
    return (
      <Container {...containerProps}>
        {this.buildForm(formProps)}
      </Container>
    );
  }
}

export default InnerEditPage;
