/**
 * @description
 *    修改密码表单
 * @author XIAJIUJIANG239
 * @createtime 2018/1/8
 */

import React, { Component, PropTypes } from 'react'
import { Select, Form, Input, Radio, DatePicker } from 'antd'

import './updatePwdForm.less'

const FormItem = Form.Item;

class UpdatePwdForm extends Component {
  constructor(props) {
    super(props)
    // 修改密码表单信息
    this.pwdFormData = [
      //{ label: '原密码', key: 'oldPwd', required: true },
      { label: '新密码', key: 'password', required: true,
        pattern: /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{6,16}$/, /* 6~16位字符，至少包含数字.字母.符号中的2种 */
        validator: this.checkConfirm
      },
      { label: '确认密码', key: 'confirmPassword', required: true, validator: this.checkPwd, onBlur: this.onConfirmBlur },
    ];

    this.state = {
      confirmDirty: false,
    }
  }

  checkPwd = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue(this.pwdFormData[0].key)) {
      callback('两次密码不一致！')
    } else {
      callback()
    }
  }

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields([this.pwdFormData[1].key], { force: true });
    }
    callback();
  }

  onConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  render() {
    const { form } = this.props;

    const { getFieldDecorator, getFieldValue } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Form className="modal-form update-pwd-form">
        {
          this.pwdFormData.map(item => {
            const rules = [
              { required: item.required, message: `请输入${item.label}` },
              { validator: item.validator }
            ]
            item.pattern && rules.push({ pattern: item.pattern, message: '6~16位，至少包含数字/字母/字符中的两种' })

            return (
              <FormItem
                key={item.key}
                {...formItemLayout}
                label={item.label}
              >
                { getFieldDecorator(item.key, { rules })(
                  <Input className='pwd-form-input'
                         type='password'
                         placeholder={`请输入${item.label}`}
                         onBlur={item.onBlur}
                  />
                ) }
              </FormItem>
            )
          })
        }
      </Form>
    )
  }
}

const UpdatePwdFormWrap = Form.create()(UpdatePwdForm);
export default UpdatePwdFormWrap
