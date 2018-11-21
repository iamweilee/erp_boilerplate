import { connect } from 'dva';
import React, { PropTypes } from 'react';
import { Table } from 'antd';

import { rowClassName } from 'common/utils/transform';

import { Container } from 'components/layout';
import { InlineRegion, Image, ImageUploader, RichRegion, RegionPane, RolesTree } from 'components/common';
import { REGIONS, AUTHS } from 'common/global/constant';

import './componentPage.less';

class Page extends React.Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);
    this.state = {
      inlineRegionValue: { provinceId: 50029, cityId: 1, regionId: 147, blockId: 148 },
      richRegionValue: {
        provinceId: 50029, cityId: 1, regionId: 88, blockId: 96,
        longitude: 109.837984, latitude: 40.666948,
        address: '仁德路'
      }
    };
  }

  onInlineRegionChange = (value) => {
    let { provinceId, cityId, regionId, blockId } = value;
    this.setState({
      result: `${provinceId || '--'} | ${cityId || '--'} | ${regionId || '--'} | ${blockId || '--'}`,
      inlineRegionValue: { ... value }
    });
  }

  onRichRegionChange = (value) => {
    this.setState({
      richRegionValue: { ...value }
    });
  }

  render = () => {
    const { result = '', inlineRegionValue, richRegionValue } = this.state;
    const containerProps = { crumbList: [{ name: '组件库', key: 'index' },{ name: 'InlineRegion', key: 'second'}], containerClass: 'components-page' };

    const listProps = {
      bordered: true,
      dataSource: [
        {
          key:  '0_' + new Date().getTime(),
          antOrderNumber: 1,
          field: 'value',
          value: 'optional | Object | { provinceId, cityId, regionId, blockId }',
          memo: '组件的值'
        },
        {
          key:  '1_' + new Date().getTime(),
          antOrderNumber: 2,
          field: 'hasProvince',
          value: 'optional | Boolean',
          memo: '组件是否配置省'
        },
        {
          key:  '2_' + new Date().getTime(),
          antOrderNumber: 1,
          field: 'hasCity',
          value: 'optional | Boolean',
          memo: '组件是否配置市'
        }
      ],
      pagination: false,
      columns: [
        {
          title: '属性',
          dataIndex: 'field',
          key: 'field',
          width: 50,
        },
        {
          title: '值',
          dataIndex: 'value',
          key: 'value',
          width: 150,
        },
        {
          title: '备注',
          dataIndex: 'memo',
          key: 'memo',
          width: 150,
        }
      ],
      rowClassName
    };

    let displayRegions = [...REGIONS];
    let allRegions = [...REGIONS];

    return (
      <Container {...containerProps}>
        <h1>InlineRegion</h1>
        <InlineRegion onChange={this.onInlineRegionChange} value={inlineRegionValue} />
        <span>{result}</span>
        <div style={{padding: 20}}>
          <Table {...listProps} />
        </div>
        <h1>RichRegion</h1>
        <RichRegion onChange={this.onRichRegionChange} value={richRegionValue} title='楼栋地址'/>
        <h1>RegionPane</h1>
        <RegionPane datasource={displayRegions} allRegions={displayRegions} />
        <h1>Image</h1>
        <Image width={96} height={72}
          src='https://dfs.anhouse.cn/view/house/fe414636d2724f639eb5f4b60e673d213c1f47d6/96x72.jpg'
          fullSrc='https://dfs.anhouse.cn/view/house/fe414636d2724f639eb5f4b60e673d213c1f47d6/900x675.jpg' />
        <h1>ImageUploader</h1>
        <ImageUploader />
        <h1>RolesTree</h1>
        <RolesTree datasource={AUTHS}/>
      </Container>
    );
  }
}

export default connect(({}) => ({}))(Page);
