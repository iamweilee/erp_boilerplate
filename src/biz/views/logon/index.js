import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Link } from 'react-router';
import { Button, Row, Col, Form, Input } from 'antd';
import { Footer } from 'components/layout';
import ErrorRow from 'components/biz/accountErrorRow';

import './index.less';

const FormItem = Form.Item;

class Logon extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    logon: PropTypes.object.isRequired,
  }


  constructor() {
    super();
    this.module = 'logon';
  }

  handleOk = () => {
    const { form, dispatch } = this.props;
    dispatch({ type: 'logon/removeGlobalError' });
    form.validateFields(['loginNo', 'password'], (err, values) => {
      if (!err) {
        dispatch({ type: 'logon/login', payload: values });
      }
    });
  }

  verifyPassword = (rule, value, callback) => {
    if (value === '') {
      callback('请输入密码');
    }
    if (value && (/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(value) || /[\uFF00-\uFFEF]/.test(value) || !/^(?![a-zA-z]+$)(?!\d+$)(?![!\"#$%&'()*+,-./:;<=>?@\[\]^_`{|}~]+$)[a-zA-Z\d!\"#$%&'()*+,-./:;<=>?@\[\]^_`{|}~]{6,16}$/.test(value))) {
      callback('最短6位且包含字母和数字');
    } else {
      callback();
    }
  }

  render() {
    const { logon } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { loginLoading, globalError, fieldErrors } = logon;

    let errorRow;
    if (globalError || (fieldErrors && fieldErrors[0] && fieldErrors[0].msg)) {
      errorRow = [
        <ErrorRow
          {...logon}
        />
      ]
    } else {
      errorRow = ''
    }
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 0 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };

    return (
      <div className="account-wrap logon-wrapper">
        <div className="logon-wrap">
          <div className="logon-form">
            <h2 className="title mb-36">西双版纳公租房管理系统</h2>
            <Form>
              {errorRow}
              <Row>
                <Col>
                  <FormItem
                    {...formItemLayout}
                  >
                    {getFieldDecorator('loginNo', {
                      rules: [
                        { required: true, message: '账号不能为空' }
                      ]
                    })(<Input size="large" placeholder="请输入账号" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormItem
                    {...formItemLayout}
                  >
                    {getFieldDecorator('password', {
                      validateTrigger: ['onSubmit'],
                      rules: [
                        {
                          required: true,
                          message: '密码不能为空'
                        },],
                    })(<Input size="large" autoComplete="off" type="password" placeholder="请输入登录密码" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Button type="primary" size="large" onClick={this.handleOk} loading={loginLoading}>
                  登录
                </Button>
              </Row>
            </Form>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default connect(({ logon }) => ({ logon }))(Form.create()(Logon,));
