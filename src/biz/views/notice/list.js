import { connect } from 'dva';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Form, Table, Button, Select, Row, Col, Input, Modal, Icon } from 'antd';
import moment from 'moment';

import { Container } from 'components/layout';
import { BaseFilteredList, ListFilterForm } from 'components/biz';
import { FormHandle } from 'components/decorator';
import SubDate from 'components/common/subDate';

import { createPageConfig, selectOptions } from 'common/utils/transform';
import { rowClassName } from 'common/utils/transform';
import { PublishStatus, NewsKeyTypes } from 'common/global/enum';


import './previewBox.less';
import DrawerForm from './edit';

/**
 * 列表筛选表单
 */
const Option = Select.Option;
const FormItem = Form.Item;

@FormHandle
class FilterForm extends ListFilterForm {
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { search, keyType, range, publishStatus, isSearch, categoryList, categoryId } = this.props;
    return (
      <Form onSubmit={this.props.handleSubmit} layout="inline">
        <FormItem style={{ position: 'absolute', zIndex: 1 }} className='with-split'>
          {
            getFieldDecorator('keyType', {
              initialValue: keyType || undefined,
            })(
              <Select style={{ width: '55px' }} onChange={this.onChange('keyType', false)} placeholder="类别">
                <Option key="-1" value="-1">不限</Option>
                { selectOptions(NewsKeyTypes.toArray(), { key: 'value', value: 'text'}) }
              </Select>,
            )
          }
        </FormItem>
        <FormItem>
          {
            getFieldDecorator('search', {
              initialValue: search || '',
            })(
              <Input className="search-input with-type" placeholder="请输入关键字" onChange={this.onChange('search', false)}/>,
            )
          }
        </FormItem>
        <FormItem className='with-split'>
          {
            getFieldDecorator('categoryId', {
              initialValue: categoryId || undefined,
            })(
              <Select style={{ width: '78px' }} onChange={this.onChange('categoryId', true)} placeholder="栏目">
                <Option key="-1" value="-1">不限</Option>
                { selectOptions(categoryList) }
              </Select>,
            )
          }
        </FormItem>
        <FormItem className='with-split'>
          {
            getFieldDecorator('publishStatus', {
              initialValue: publishStatus || undefined,
            })(
              <Select style={{ width: '78px' }} onChange={this.onChange('publishStatus', true)} placeholder="发布状态">
                <Option key="-1" value="-1">不限</Option>
                { selectOptions(PublishStatus.toArray(), { key: 'value', value: 'text'}) }
              </Select>,
            )
          }
        </FormItem>
        <FormItem>
          {
            getFieldDecorator('range', {
              initialValue: range,
            })(
              <SubDate onChange={this.onChange('range', false)} noInit={true}/>
            )
          }
        </FormItem>
        <Button type="primary" size={'default'} htmlType="submit" style={{ marginRight: '12px' }} className="search-button"><Icon type="search" /></Button>
        { isSearch && <Button type="primary" size={'default'}
          className="button-like-link" onClick={this.clear}><Icon type="delete" />清空</Button> }
      </Form>
    );
  }
}

const confirm = Modal.confirm;

const modelName = 'noticeList';

class List extends BaseFilteredList {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    [modelName]: PropTypes.object.isRequired,
  }

  constructor() {
    super();
    this.module = modelName;
    this.entityDesc = '文章';
  }

  onPublish = (id) => {
    return () => {
      confirm({
        title: '确认发布么?',
        content: '点击确认，完成发布！',
        onOk: () => {
          this.props.dispatch({
            type: `${this.module}/publish`,
            payload: id
          });
        },
        onCancel() {},
      });
    }
  }

  onOffline = (id) => {
    return () => {
      confirm({
        title: '确认下架么?',
        content: '点击确认，完成下架！',
        onOk: () => {
          this.props.dispatch({
            type: `${this.module}/offline`,
            payload: id
          });
        },
        onCancel() {},
      });
    }
  }

  preview = (id) => {
    return () => {
      this.props.dispatch({
        type: `${this.module}/preview`,
        payload: id
      });
    }
  }

  closePreview = () => {
    this.props.dispatch({
      type: `${this.module}/closePreview`
    });
  }

  buildColumns = () => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 50,
      },
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        width: 150,
      },
      {
        title: '作者/来源',
        dataIndex: 'editor',
        key: 'editor',
        width: 80,
        render: (value, item) => {
          let text = [];
          item.editor && text.push(item.editor);
          item.source && text.push(item.source);
          return (
            <span>{text.join('/')}</span>
          );
        },
      },
      {
        title: '栏目',
        dataIndex: 'categoryName',
        key: 'categoryName',
        width: 80
      },
      {
        title: '状态',
        dataIndex: 'publishStatus',
        key: 'publishStatus',
        width: 40,
      },
      {
        title: '阅读数',
        dataIndex: 'readCount',
        key: 'readCount',
        width: 50,
      },
      {
        title: '创建人',
        dataIndex: 'creator',
        key: 'creator',
        width: 50
      },
      {
        title: '发布时间',
        dataIndex: 'publishedAt',
        key: 'publishedAt',
        width: 100,
      },
      {
        title: '操作',
        width: 100,
        key: 'action',
        className: 'table-action',
        render: (text, item) => {
          return (
            <div>
              {
                PublishStatus.getTextFromAlias('DRAFT') === item.publishStatus &&
                <Button type="primary" className="button-like-link" onClick={this.onEdit(item.id)}>编辑</Button>
              }
              <Button className="button-like-link" onClick={this.preview(item.id)}>预览</Button>
              {
                PublishStatus.getTextFromAlias('DRAFT') !== item.publishStatus &&
                <Button className="button-like-link" onClick={this.onOffline(item.id)}>下架</Button>
              }
              {
                PublishStatus.getTextFromAlias('DRAFT') === item.publishStatus &&
                <Button className="button-like-link" onClick={this.onPublish(item.id)}>发布</Button>
              }
              {
                PublishStatus.getTextFromAlias('DRAFT') === item.publishStatus &&
                <Button className="button-like-link" onClick={this.onDelete(item.id)}>删除</Button>
              }
            </div>
          );
        },
      }
    ];
  }

  doRender = ({containerProps}) => {
    const { showPreviewModal, previewData, categoryList } = this.props[this.module];
    return (
      <Container {...containerProps}>
        <div className="list-action">
          <Button type="primary" onClick={this.showForm}>新增{this.entityDesc}</Button>
        </div>
        {
          this.buildFilter(FilterForm, { categoryList })
        }
        {
          this.buildList({ columns: this.buildColumns() })
        }
        {
          this.buildDrawer(DrawerForm)
        }
        <Modal
          visible={showPreviewModal}
          onCancel={this.closePreview}
          footer={null}
          width={600}
        >
          <div id="previewbox">
            <div id="preview-content">
              <div className="article-title">
                <h1 style={{padding: '0 20px',}}>{previewData.title}</h1>
              </div>
              <div className="article-info">
                <div className="article-info-time">{previewData.publishedAt}</div>
              </div>
              <div className="article-content">
                <div style={{padding: 20}} dangerouslySetInnerHTML={{__html: previewData.content}}></div>
              </div>
            </div>
          </div>
        </Modal>
      </Container>
    );
  }
}

export default connect(({ noticeList }) => ({ noticeList }))(List);
