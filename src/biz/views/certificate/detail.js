import { connect } from 'dva';
import React, { PropTypes } from 'react';
import { Button, Modal, Input, Select, Alert, Card, Icon, Col, Row, Tag, Affix, Avatar, Table, Tooltip } from 'antd';
import _ from 'underscore';

import { DrawerModal } from 'components/decorator';
import { Container } from 'components/layout';
import { InnerDetailPage } from 'components/biz';

import Detail from './detailContent';

import { transform } from 'common/utils';
import { AuditStatus } from 'common/global/enum';

const Option = Select.Option;
const confirm = Modal.confirm;

const modelName = 'certificateDetail';

@DrawerModal
class Page extends InnerDetailPage {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    [modelName]: PropTypes.object.isRequired,
  }

  constructor() {
    super();
    this.module = modelName;
  }

  verify = () => {
    this.props.dispatch({
      type: `${this.module}/verify`
    });
  }

  frameVerify = () => {
    this.props.dispatch({
      type: `${this.module}/frameVerify`
    });
  }

  onPass = () => {
    confirm({
      title: '确认通过审核么?',
      content: '点击确认，通过审核！',
      onOk: () => {
        this.props.dispatch({
          type: `${this.module}/pass`
        });
      },
      onCancel() {},
    });
  }

  toDeny = () => {
    this.props.dispatch({
      type: `${this.module}/toDeny`
    });
  }

  doDeny = () => {
    this.props.dispatch({
      type: `${this.module}/deny`
    });
  }

  syncReason= (e) => {
    this.props.dispatch({
      type: `${this.module}/syncReason`,
      payload: e
    });
  }

  syncReasonInput = (e) => {
    this.props.dispatch({
      type: `${this.module}/syncReasonInput`,
      payload: e.target.value
    });
  }

  cancelDeny = () => {
    this.props.dispatch({
      type: `${this.module}/cancelDeny`
    });
  }

  toggleValid = (type) => {
    return (id) => {
      this.props.dispatch({
        type: `${this.module}/toggleValid`,
        payload: { id, type }
      });
    }
  }

  onSingleDeny = (id) => {
    return () => {
      this.props.dispatch({
        type: `${this.module}/toSingleDeny`,
        payload: id
      });
    }
  }

  actionColumnRender = (value, item) => {
    // 不是驳回状态，且未租
    return (
      <div>
      {
        item.auditStatus != AuditStatus.getValueFromAlias('FAIL')
        && item.auditStatus != AuditStatus.getValueFromAlias('SUCCESS')
        && <Button className="axg-button-like-link" onClick={this.onSingleDeny(item.id)}>驳回</Button>
      }
      {
        item.auditStatus != AuditStatus.getValueFromAlias('READY') && <span>{AuditStatus.getTextFromValue(item.auditStatus)}&nbsp;&nbsp;</span>
      }
      {
        item.rejectReason && <Tooltip placement="top" title={item.rejectReason + '：' + item.rejectReasonCustom}><Icon type="info-circle" /></Tooltip>
      }
      </div>
    );
  }

  render = () => {
    const containerProps = {
      crumbList: [
        { name: '房源审核', key: 'index' },
        { name: '审核详情', key: 'second' },
      ],
      containerClass: 'detail-page certifcate-detail'
    };

    let { entity, id, showDenyReason, reason, reasonInput } = this.props[this.module];
    if (entity && entity.housingInfo) {
      let { housingInfo } = entity;
      containerProps.crumbOperation = <div className="detail-action-wrapper">
          { housingInfo.auditStatus == AuditStatus.getValueFromAlias('READY')
            && <Button type="primary" onClick={this.onPass} style={{marginRight: 10}}>通过</Button>
          }
          { housingInfo.auditStatus == AuditStatus.getValueFromAlias('READY')
            && <Button type="primary" className="ant-btn-del" onClick={this.toDeny}>驳回</Button>
          }
      </div>;

      return (
        <Container { ...containerProps }>
          {
            housingInfo.auditStatus == AuditStatus.getValueFromAlias('FAIL')
            && <Alert message={'已驳回：' + (housingInfo.rejectReason || '无类别' )} description={housingInfo.rejectReasonCustom} type="error" showIcon />
          }
          {
            housingInfo.auditStatus == AuditStatus.getValueFromAlias('SUCCESS')
            && <Alert message={AuditStatus.getTextFromValue(housingInfo.auditStatus)} type="success" showIcon />
          }
          {
            housingInfo.auditStatus == AuditStatus.getValueFromAlias('READY')
            && <Alert message={AuditStatus.getTextFromValue(housingInfo.auditStatus)} type="info" showIcon />
          }

          <Detail
            entity={entity} actionColumnRender={this.actionColumnRender} isCertificate={true}
            toggleValid={this.toggleValid} verify={this.verify} frameVerify={this.frameVerify}/>

          <Modal
            visible={showDenyReason}
            title="驳回理由"
            onOk={this.doDeny}
            onCancel={this.cancelDeny}
            width={450}
          >
            <div style={{marginTop: '20px'}}>
              <Input style={{ width: '400px' }} className="text-area" type="textarea" placeholder="请输入驳回理由" onChange={this.syncReasonInput} value={reasonInput}/>
            </div>
          </Modal>
        </Container>
      );
    }

    return (<div></div>);
  }
}

export default connect(({ certificateDetail }) => ({ certificateDetail }))(Page);
