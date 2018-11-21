import { connect } from 'dva';
import React, { PropTypes } from 'react';
import { Button, Select, Form, Radio, Input, Modal, Icon, Row, Col, Tag } from 'antd';

import { Container } from 'components/layout';
import { BaseFilteredList, ListFilterForm } from 'components/biz';
import { FormHandle } from 'components/decorator';

import permission from 'common/permission';
import { AccountSubject, AccountStatus } from 'common/global/enum'

import DrawerForm from './edit';
import UpdatePwdFormWrap from './updatePwdForm'

/**
 * 列表筛选表单
 */
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;

const modelName = 'staffList';

@FormHandle
class FilterForm extends ListFilterForm {

  render() {
    let { form, keyword, type, isDeleted, isSearch } = this.props;

    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.props.handleSubmit} layout="inline">
        <FormItem>
          {
            getFieldDecorator('keyword', {
              initialValue: keyword || '',
            })(
              <Input style={{ width: '220px' }} placeholder="请输入用户ID" onChange={this.onChange('keyword', false)}/>,
            )
          }
        </FormItem>
        <FormItem  label="账号主体">
          {
            getFieldDecorator('type', {
              initialValue: type || -1,
            })(
              <Select style={{ width: 110 }} onChange={this.onChange('type', true)}>
                { AccountSubject.toCheckArray(true).map(item => <Option value={item.value} key={item.value}>{item.label}</Option>) }
              </Select>
            )
          }
        </FormItem>
        <FormItem  label="账号状态">
          {
            getFieldDecorator('isDeleted', {
              initialValue: isDeleted === undefined ? -1 : isDeleted,
            })(
              <Select style={{ width: 110 }} onChange={this.onChange('isDeleted', true)}>
                { AccountStatus.toCheckArray(true).map(item => <Option value={item.value} key={item.value}>{item.label}</Option>) }
              </Select>
            )
          }
        </FormItem>
        <Button type="primary" size={'default'} htmlType="submit" style={{ marginRight: '12px' }}>搜索</Button>
        { isSearch && <Button type="primary" size={'default'}
                              className="button-like-link" onClick={this.clear}>重置</Button> }
      </Form>
    );
  }
}

class List extends BaseFilteredList {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    [modelName]: PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.module = modelName;
    this.entityDesc = '员工';
    this.state = {
      updatePwdVisible: false
    }
  }
  onUpdatePwd = id => this.setState({
    targetId: id,
    updatePwdVisible: true,
  })

  onUpdatePwdOK = () => {
    this.refs.updatePwdForm.validateFields((err, values) => {
      if (err) return;
      this.props.dispatch({
        type: `${this.module}/updatePwd`,
        payload: { data: { ...values } , id: this.state.targetId }
      })
      this.onUpdatePwdCancel()
    })
  }

  onUpdatePwdCancel = () => this.setState({ updatePwdVisible: false })

  onChangeStatus = (item, status) => {
    const operateLabel = status === 'unfrozen' ? '恢复' : '冻结'
    confirm({
      title: `确定要${operateLabel}账户 ${item.userName} 吗？`,
      onOk: () => {
        this.props.dispatch({
          type: `${this.module}/${status}`,
          payload: item.id
        })
      }
    })
  }

  buildColumns = () => {
    return [
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        width: 70,
      },
      {
        title: '最近活跃时间',
        dataIndex: 'lastLoginDate',
        key: 'lastLoginDate',
        width: 70
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
        width: 70
      },
      {
        title: '账号主体',
        dataIndex: 'type',
        key: 'type',
        width: 70,
        render: value => AccountSubject.getTextFromValue(value)
      },
      {
        title: '所属公司',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 70
      },
      {
        title: '状态',
        dataIndex: 'isDeleted',
        key: 'isDeleted',
        width: 70,
        render: value => AccountStatus.getTextFromValue(value)
      },
      {
        title: '操作',
        width: 120,
        key: 'action',
        className: 'table-action',
        render: (text, item) => {
          const { isDeleted, id } = item;
          const actionItems = [];

          if (AccountStatus.getAliasFromValue(item.isDeleted) === 'NORMAL') {
            if (permission.isAllow(['XSBN_ACCOUNT_FROZEN'])) {
              actionItems.push(
                <Button type="primary" className="button-like-link" onClick={this.onChangeStatus.bind(this, item, 'frozen')}>冻结</Button>
              );
            }
          }
          else {
            if (permission.isAllow(['XSBN_ACCOUNT_UNFROZEN'])) {
              actionItems.push(
                <Button type="primary" className="button-like-link" onClick={this.onChangeStatus.bind(this, item, 'unfrozen')}>恢复</Button>
              );
            }
          }
          if (permission.isAllow(['XSBN_ACCOUNT_EDIT'])) {
            actionItems.push(
              <Button type="primary" className="button-like-link" onClick={this.onEdit(id)}>编辑</Button>
            );
          }
          // 重置密码权限
          if (permission.isAllow(['XSBN_ACCOUNT_RESET_PASSWORD'])) {
            actionItems.push(
              <Button type="primary" className="button-like-link" onClick={this.onUpdatePwd.bind(this, id)}>修改密码</Button>
            );
          }

          return (
            <span>
              {actionItems}
            </span>
          );
        },
      }
    ];
  }

  doRender = ({containerProps}) => {
    const { updatePwdVisible } = this.state;
    return (
      <Container {...containerProps}>
        {
          permission.isAllow(['XSBN_ACCOUNT_ADD']) &&
          <div className="list-action">
            <Button type="primary" onClick={this.showForm}>新增{this.entityDesc}</Button>
          </div>
        }
        {
          this.buildFilter(FilterForm)
        }
        {
          this.buildList({ columns: this.buildColumns() })
        }
        {
          this.buildDrawer(DrawerForm)
        }
        <Modal
          key={ 'password-' + this.state.targetId + new Date()}
          title='修改密码'
          visible={updatePwdVisible}
          onOk={this.onUpdatePwdOK}
          onCancel={this.onUpdatePwdCancel}
        >
          <UpdatePwdFormWrap ref="updatePwdForm" />
        </Modal>
      </Container>
    );
  }
}

export default connect(({ staffList }) => ({ staffList }))(List);
