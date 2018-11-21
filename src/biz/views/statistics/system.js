import { connect } from 'dva';
import React, { PropTypes } from 'react';

import { Container } from 'components/layout';
import DataCard from  './components/dataCard';

const modelName = 'system';

class Page extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    [modelName]: PropTypes.object.isRequired,
  }

  constructor() {
    super();
    this.module = modelName;
  }

  componentWillMount = () => {
    this.props.dispatch({
      type: `${this.module}/getData`
    });
  }

  render = () => {
    const model = this.props[this.module];

    const { crumbList, entity } = model;

    const staffInfo = [
      {
        value: entity.numAll,
        label: '累计账号数'
      },
      {
        value: entity.numGov,
        label: '累计政府干部'
      },
      {
        value: entity.numOp,
        label: '累计运营人员'
      },
      {
        value: entity.numCompany,
        label: '累计合作公司'
      }
    ];

    const applyInfo = [
      {
        value: entity.numApplyAll,
        label: '累计处理申请'
      },
      {
        value: entity.numApplyDone,
        label: '累计已完结申请'
      },
      {
        value: entity.numApplyTodo,
        label: '累计待处理申请'
      }
    ]

    const containerProps = { crumbList };

    return (
      <Container {...containerProps}>
        <DataCard title="人员信息" detail={staffInfo} />
        <DataCard title="申请信息" detail={applyInfo} />
      </Container>
    );
  }
}

export default connect(({system}) => ({system}))(Page);
