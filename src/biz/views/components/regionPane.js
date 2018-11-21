import { connect } from 'dva';
import React, { PropTypes } from 'react';
import { Table } from 'antd';

import { rowClassName } from 'common/utils/transform';

import { Container } from 'components/layout';
import { RegionPane } from 'components/common';
import { REGIONS } from 'common/global/constant';

import './componentPage.less';

class Page extends React.Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render = () => {
    const { result = '', inlineRegionValue, richRegionValue } = this.state;
    const containerProps = { crumbList: [{ name: '组件库', key: 'index' },{ name: 'RegionPane', key: 'second'} ], containerClass: 'components-page' };

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
        <h1>RegionPane</h1>
        <RegionPane datasource={displayRegions} allRegions={displayRegions} />
      </Container>
    );
  }
}

export default connect(({}) => ({}))(Page);
