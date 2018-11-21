import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Layout, Spin } from 'antd';
import { Header as CustomHeader,  NarrowSiderMenu } from 'components/layout';
import 'static/css/style2.less';

const { Content, Header, Sider } = Layout;

class Page extends React.Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    frame: PropTypes.object.isRequired,
  };

  componentWillMount = () => {
    this.props.dispatch({
      type: 'frame/getData',
    });
  }

  render = () => {
    const { children, dispatch, frame, loading } = this.props;
    const siderProps = {
      frame,
      handleSelect(payload) {
        dispatch({
          type: 'frame/switchModule',
          payload
        });
      }
    };

    const headerProps = {
      frame,
      logoutPage() {
        dispatch({
          type: 'frame/logout',
          payload: 'clear'
        });
      },
      title: '管理系统演示'
    };

    const { userId } = frame;

    if (userId) {
      return (
        <div className="has-sider-page">
          <Spin spinning={ loading.global }>
          </Spin>
          <Sider width={63} trigger={null}>
            <NarrowSiderMenu {...siderProps} />
          </Sider>
          <Layout>
            <Header>
              <CustomHeader {...headerProps} />
            </Header>
            <Content id="body" style={{ overflow: 'initial' }}>
              { children }
            </Content>
          </Layout>
        </div>
      );
    }

    return (
      <div className="has-sider-page">
        <Spin spinning={ loading.global }>
        </Spin>
      </div>
    );
  }
}

export default connect(({ frame, loading }) => ({ frame, loading }))(Page);
