import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Layout, Spin } from 'antd';
import { Header as CustomHeader,  SiderMenu } from 'components/layout';
import 'static/css/frame.less';

const { Content, Header, Sider } = Layout;

class Frame extends React.Component {

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

    return (
      <div className="has-sider-page">
        <Spin spinning={ loading.global }>
        </Spin>
        { userId &&
          <Layout>
            <Header>
              <CustomHeader {...headerProps} />
            </Header>
            <Layout>
              <Sider trigger={null}>
                <SiderMenu {...siderProps} />
              </Sider>
              <Content id="body" style={{ overflow: 'initial' }}>
                { children }
              </Content>
            </Layout>
          </Layout>
        }
      </div>
    );
  }
}

export default connect(({ frame, loading }) => ({ frame, loading }))(Frame);
