import React, { PropTypes } from 'react';
import { Button, Modal, Input, Select, Alert, Card, Icon, Col, Row, Tag, Affix, Avatar, Table } from 'antd';

import Label from 'components/common/label';

import { transform } from 'common/utils';
import { AuditStatus, BusinessModel, CreditStatus, RentType } from 'common/global/enum';

import './detail.less';

function buildRoomTables(datasource, isCentral, totalFloor, actionColumnRender) {
  let columns = [
    {
      title: isCentral ? '室号' : '房间号',
      dataIndex: 'name',
      key: 'name',
      width: 70
    },
    {
      title: '面积（平米）',
      dataIndex: 'space',
      key: 'space',
      width: 70,
      render: text => text / 100
    },
    {
      title: '租金（元/月）',
      dataIndex: 'rent',
      key: 'rent',
      width: 70,
      render: text => text / 100
    },
    {
      title: '朝向',
      dataIndex: 'towardName',
      key: 'towardName',
      width: 70
    }
  ];

  if (isCentral) {
    columns.push(
    {
      title: '当前楼层/总楼层',
      dataIndex: 'inFloor',
      key: 'inFloor',
      width: 70,
      render: (text, item) => item.inFloor + '/' + totalFloor
    });
  }

  columns.push(
    {
      title: '出租状态',
      dataIndex: 'rentStatusName',
      key: 'rentStatusName',
      width: 70
    }
  );

  if (isCentral) {
    columns.push({
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 70,
      className: 'axg-table-action',
      render: actionColumnRender
    });
  }

  return (
    <Table
      columns = { columns }
      dataSource = { datasource }
      pagination = { false }
      rowKey = "key"
      bordered
    />
  );
}

export default function(props) {

  const { entity, actionColumnRender, isCertificate } = props;

  let { houseCertificate, publisher, housingInfo, verifyInfo, roomList, layoutInfo, buildingInfo } = entity;

  housingInfo = housingInfo || {};
  layoutInfo = layoutInfo || {};
  buildingInfo = buildingInfo || {};

  const isCentral = housingInfo && BusinessModel.getAliasFromValue(housingInfo.category) === 'CENTRAL';

  let { buildingNo, unitNo, roomNo, districtName, blockName, communityName } = isCentral ? buildingInfo : housingInfo;

  let door = '';
  if (buildingNo) {
    door += buildingNo + '-';
  }
  if (unitNo) {
    door += unitNo;
  }

  if (roomNo) {
    door += '-' + roomNo;
  }

  // 拼装房源标题
  let title = `${districtName || ''}-${blockName || ''}-${communityName || ''}-${door}`;

  // 拼产权
  let propertyOwner = [];

  // 共有产权
  if (houseCertificate && houseCertificate.propertyOwner) {
    if (houseCertificate.propertyOwner.length == 1) {
      propertyOwner.push(<Label title={ '共有产权人信息' } value={ transform.formatImages(houseCertificate.propertyOwner[0].pics) } type={ 'image' } width={120} height={90} />);
    }
    else {
      propertyOwner = houseCertificate.propertyOwner.map((item, index) => {
        return <Label title={ '共有产权人' + (index + 1) + '信息' } value={ transform.formatImages(item.pics) } type={ 'image' } width={120} height={90} />;
      });
    }
  }

  // 头像样式
  let avatarClassName;
  if (publisher) {
    if (publisher.type == 1) {
      avatarClassName = 'man';
    }
    else if (publisher.type == 2) {
      avatarClassName = 'company';
    }
    else {
      avatarClassName = 'agent';
    }
  }

  debugger;

  return (
    <div className="detail-content-wrapper">
      <Card className="certifcate-detail-block with-bottom">
        <Row className="certifcate-detail-header">
          <Col span={17} className="certifcate-detail-header-housing-info">
              <p className="certifcate-detail-header-housing-info-title">{title}
                { housingInfo.type && <Tag className="primary-frame-tag">{housingInfo.type}</Tag> }
                { housingInfo.category && <Tag className="primary-frame-tag">{BusinessModel.getTextFromValue(housingInfo.category)}</Tag> }
                { housingInfo.rentType && <Tag className="primary-frame-tag">{RentType.getTextFromValue(housingInfo.rentType)}</Tag> }
              </p>
              <p className="certifcate-detail-header-housing-info-sub-title">
                <span className="rent">{ housingInfo.rentPrice / 100 }元/月{ isCentral ? '起' : '' }</span>
                &nbsp;&nbsp;&nbsp;{ housingInfo.paymentWayName }&nbsp;&nbsp;{ CreditStatus.getTextFromValue(housingInfo.creditStatus) }信用免押
              </p>
              <p className="certifcate-detail-header-housing-info-tip">ID:{ housingInfo.id || '-' }&nbsp;&nbsp;{ housingInfo.channelName || '-' }</p>
          </Col>
          { publisher &&
            <Col span={7} className="certifcate-detail-header-publisher-info">
              <div className={ 'avatar ' +  avatarClassName } />
              <div className="base-info" >
                  <p><div className="title" title={publisher.name}>{publisher.name  || '-'}</div><Tag className="primary-frame-tag">{publisher.typeDesc}</Tag></p>
                  <p>发房人电话：{ publisher.publishMobile || '-' }</p>
                  <p>联系人电话：{ publisher.linkmanMobile || '-' }</p>
              </div>
            </Col>
          }
        </Row>
      </Card>
      <div className={!isCentral ? 'right-fix-400-layout' : ''}>
        <div className='right-fix-400-left' >
          { houseCertificate &&
          <Card className="certifcate-detail-block" title="产权信息">
            <Label title={ '产证编号' } value={ houseCertificate.propertyRightNo || '-' } />
            <Label title={ '产权人身份证' } value={ houseCertificate.propertyRightCardNo || '-' } />
            <Label title={ '产权人姓名' } value={ houseCertificate.propertyRightName || '-' } />
            <Label title={ '产权证图片' } value={ houseCertificate.propertyPic} type={ 'image' } width={120} height={90}/>
            <Label title={ '房屋土地性质' } value={ houseCertificate.natureLandName || '-' } />
            <Label title={ '是否共有产权' } value={ houseCertificate.crpStatus == 0 ? '否' : '是' } />
            {propertyOwner}
          </Card>
          }
          {
            isCentral &&
            <Card className="certifcate-detail-block" title="楼栋信息">
              <Label title={ '区域-版块' } value={ buildingInfo.districtName + '-' + buildingInfo.blockName } />
              <Label title={ '楼栋名' } value={ buildingInfo.communityName || '-' } />
              <Label title={ '楼栋地址' } value={ buildingInfo.address || '-' } />
              <Label title={ '总楼层数' } value={ (housingInfo.totalFloor || '-') + '层' } />
              <Label title={ '房东要求' } value={ buildingInfo.landlordRequestDesc || '-' } />
              <Label title={ '楼栋照片' } value={ buildingInfo.communityPics } type="image" width={120} height={90}/>
            </Card>
          }
          {
            isCentral &&
            <Card className="certifcate-detail-block" title="房型信息">
              <Label title={ '房型名称' } value={ layoutInfo.name } />
              <Label title={ '面积' } value={ layoutInfo.space } type="space" />
              <Label title={ '装修类型' } value={ layoutInfo.situationName } />
              <Label title={ '付款方式' } value={ housingInfo.paymentWayName } />
              <Label title={ '租金' } value={ housingInfo.rentPrice } type="money" />
              <Label title={ '房源标签' } value={ layoutInfo.tagsDesc || '-'} />
              <Label title={ '配套设施' } value={ layoutInfo.collocationName || '-' } />
              <Label title={ '备注' } value={ layoutInfo.desc || '-' } type="richText"/>
              { roomList && !!roomList.length && buildRoomTables(roomList, isCentral, housingInfo.totalFloor, actionColumnRender) }
            </Card>
          }
          {
            !isCentral &&
            <Card className="certifcate-detail-block" title="房源信息">
              <Label title={ '区域-版块' } value={ housingInfo.districtName + '-' + housingInfo.blockName } />
              <Label title={ '小区名' } value={ housingInfo.communityName || '-' } />
              <Label title={ '小区地址' } value={ housingInfo.address || '-' } />
              <Label title={ '房源门牌' } value={ door } />
              <Label title={ '总楼层数' } value={ (housingInfo.totalFloor || '-') + '层' } />
              <Label title={ '所在楼层' } value={ (housingInfo.inFloor || '-') + '层' } />
              <Label title={ '面积' } value={ housingInfo.space } type="space" />
              <Label title={ '装修类型' } value={ housingInfo.situationName } />
              <Label title={ '付款方式' } value={ housingInfo.paymentWayName } />
              <Label title={ '租金' } value={ housingInfo.rentPrice } type="money" />
              <Label title={ '朝向' } value={ housingInfo.towardName || '-' } />
              <Label title={ '房源标签' } value={ housingInfo.tagsDesc || '-'} />
              <Label title={ '房东要求' } value={ housingInfo.landlordRequestDesc || '-' } />
              <Label title={ '配套设施' } value={ housingInfo.collocationName || '-' } />
              <Label title={ '联系电话' } value={ housingInfo.mobile || '-' } />
              <Label title={ '备注' } value={ housingInfo.desc || '-' } type="richText"/>
              { roomList && !!roomList.length && buildRoomTables(roomList, isCentral, housingInfo.totalFloor, actionColumnRender) }
            </Card>
          }
        </div>
      </div>
    </div>
  );
}
