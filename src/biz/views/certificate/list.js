import { connect } from 'dva';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Table, Button, Col, Row, Card, Tag, Icon, Modal, Select, Form, Input } from 'antd';

import { Container } from 'components/layout';
import { BaseFilteredList, ListFilterForm } from 'components/biz';
import { FormHandle } from 'components/decorator';

import permission from 'common/permission';
import { AuditStatus } from 'common/global/enum';

// import DrawerFormEdit from './edit';
import DrawerDetail from './detail';

/**
 * 列表筛选表单
 */
const Option = Select.Option;
const FormItem = Form.Item;

const modelName = 'certificateList';

@FormHandle
class FilterForm extends ListFilterForm {

  render() {
    let { form, keyword, auditStatus, isSearch } = this.props;

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
        <FormItem className='with-split'>
        {
          getFieldDecorator('auditStatus', {
            initialValue: auditStatus || undefined,
          })(
            <Select style={{ width: '80px' }} onChange={this.onChange('auditStatus', true)} placeholder="审核状态">
              <Option key="-1" value="-1">不限</Option>
              { AuditStatus.toCheckArray(true).map(item => <Option value={item.value} key={item.value}>{item.label}</Option>) }
            </Select>,
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
    this.entityDesc = '审核';
  }

  buildColumns = () => {
    return [
      {
        title: '房源编号',
        dataIndex: 'id',
        key: 'id',
        width: 40
      },
      {
        title: '房源',
        dataIndex: 'name',
        key: 'name',
        width: 150
      },
      {
        title: '房源性质',
        dataIndex: 'type',
        key: 'type',
        width: 80
      },
      {
        title: '审核状态',
        dataIndex: 'auditStatus',
        key: 'auditStatus',
        width: 60,
        render: (value, item) => {
          return AuditStatus.getTextFromValue(value);
        }
      },
      {
        title: '操作',
        width: 50,
        key: 'action',
        className: 'table-action',
        render: (text, item) => {
          return (
              <Button type="primary" className="button-like-link" onClick={this.onRead(item.id)}>查看详情</Button>
          );
        },
      }
    ];
  }

  batchPass = () => {
    const { selectedRows } = this.state;

    if (selectedRows.length) {
      this.props.dispatch({
        type: `${this.module}/batchPass`,
        payload: selectedRows
      });

      this.setState({ selectedRows: [], selectedRowKeys: [] });
    }
  }

  doRender = ({containerProps}) => {
    return (
      <Container {...containerProps}>
        {
          <div className="list-action">
            <Button type="primary" onClick={this.batchPass}>审核通过</Button>
            <Button type="primary" onClick={this.showForm}>新增{this.entityDesc}</Button>
          </div>
        }
        {
          this.buildFilter(FilterForm)
        }
        {
          this.buildList({ columns: this.buildColumns(), needBatch: true, batchResultKey: 'id' })
        }
        {
          this.buildDetailDrawer(DrawerDetail)
        }
      </Container>
    );
  }
}

export default connect(({ certificateList }) => ({ certificateList }))(List);
