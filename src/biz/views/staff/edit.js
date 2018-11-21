import { connect } from 'dva';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Table, Button, Col, Row, Radio, Card, Form, Select, Input } from 'antd';

import { DrawerModal } from 'components/decorator';
import { Container } from 'components/layout';
import { InnerEditPage } from 'components/biz';

import StaffForm from './components/staffForm';

const modelName = 'staffEdit';

@DrawerModal
class Page extends InnerEditPage {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    [modelName]: PropTypes.object.isRequired,
  }

  constructor() {
    super();
    this.module = modelName;
  }

  switchType = (value) => {
    this.props.dispatch({
      type: `${this.module}/switchType`,
      payload: value,
    });
  }

  buildForm = (props) => {
    const { roleList, companyList } = this.props[this.module];
    return (
      <StaffForm
        {...props}
        roleList={roleList}
        companyList={companyList}
        onSwitchType={ this.switchType }
      />
    );
  }
}

export default connect(({ staffEdit }) => ({ staffEdit }))(Page);
