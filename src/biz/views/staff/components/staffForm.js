import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Button, Form, Alert } from 'antd';

import { stringyValue } from 'common/utils/transform';

import FormHandle from 'components/decorator/formHandle';
import FormInputField from 'components/common/inputFormField';
import { AccountSubject } from 'common/global/enum'

const FormItem = Form.Item;

@FormHandle
class StaffForm extends Component {
  constructor(props) {
    super(props);
  }

  switchType = (e) => {
    this.props.onSwitchType(e.target.value);
  }

  onSubmit = (e) => {
    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.props.handleSubmit(e)
    })
  }

  render = () => {
    const { getFieldDecorator } = this.props.form;
    const { entity, roleList, companyList } = this.props;

    return (
      <Form className="staff-form">
        <FormItem className="axg-form-section-title">
          <h1>产权信息</h1>
          <Alert className="no-frame-alert" message="个人只能发布自己下辖房源，中小房行若需发布他人房源，请前往账户进行资质认证" type="info" showIcon/>
        </FormItem>
        <FormInputField
          getFieldDecorator={getFieldDecorator}
          label="账号名"
          field="userName"
          required={true}
          pattern={ /^[a-zA-Z0-9_]{1,20}$/ }
          patternTip="1~20位 数字、英文、下划线"
          entity={entity}
          style={{ width: 200 }}/>
        {
          entity.id === undefined &&
          <FormInputField
            getFieldDecorator={getFieldDecorator}
            label="密码"
            field="password"
            required={true}
            entity={entity}
            style={{ width: 200 }}/>
        }
        {
          entity.id === undefined &&
          <FormInputField
            getFieldDecorator={getFieldDecorator}
            label="确认密码"
            field="confirmPassword"
            required={true}
            entity={entity}
            style={{ width: 200 }}/>
        }
        <FormInputField
          getFieldDecorator={getFieldDecorator}
          label="账号主体"
          type="radio"
          field="type"
          required={true}
          entity={entity}
          datasource={stringyValue(AccountSubject.toCheckArray(), 'value')}
          onSwitch={this.switchType}
          style={{ width: 200 }}/>
        {
          entity.type == AccountSubject.getValueFromAlias('OPE_PERSON') && <FormInputField
          getFieldDecorator={getFieldDecorator}
          type="select"
          label="所属公司"
          field="companyId"
          required={true}
          entity={entity}
          style={{ width: 200 }}
          datasource={stringyValue(companyList, 'key')}
          keyMapOptions={{ key: 'key', value: 'name'}}/>
        }
        <FormInputField
          getFieldDecorator={getFieldDecorator}
          type="select"
          label="员工角色"
          field="roleId"
          required={true}
          entity={entity}
          style={{ width: 200 }}
          datasource={stringyValue(roleList, 'key')}
          keyMapOptions={{ key: 'key', value: 'name'}}/>
        <FormInputField
          getFieldDecorator={getFieldDecorator}
          label="账号备注"
          field="remark"
          required={false}
          pattern={ /^\S{0,20}$/ }
          patternTip="长度20位以内"
          entity={entity}
          style={{ width: 200 }}/>
        <FormItem className="form-action-button">
          <Button type="primary" onClick={this.onSubmit} size="large">保存</Button>
          <Button className="button-like-link" type="default" onClick={this.props.handleCancel} size="large">取消</Button>
        </FormItem>
      </Form>
    );
  }
}

export default StaffForm;
