import React, { PropTypes } from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'dva/router';

function getHeightByWindow() {
  return Math.max(window.innerHeight - 80, 500);
}

export default class Container extends React.Component {

  constructor(props) {
    super(props);
    this.state = { windowHeight: getHeightByWindow() };
  }

  componentDidMount = () => {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleResize);
  }


  handleResize = (e) => {
    this.setState({ windowHeight: getHeightByWindow() });
  }

  render () {
    const { children, containerClass, crumbList, crumbOperation } = this.props;
    let { windowHeight } = this.state;
    const breadcrumbItems = crumbList.map((item, index) => {
      if (index === (crumbList.length - 1)) {
        return (<Breadcrumb.Item key={item.key}>{ item.name }</Breadcrumb.Item>);
      }
      return (<Breadcrumb.Item key={item.key}><Link to={item.path}>{ item.name }</Link></Breadcrumb.Item>);
    });

    return (
      <div className={ containerClass || '' } id="content" style={{minHeight: windowHeight }}>
        <div className="page-crumbs card-block">
          <Breadcrumb separator=" ">
            { breadcrumbItems }
          </Breadcrumb>
          { crumbOperation }
        </div>
        <div className="page-container">
          { children }
        </div>
      </div>
    );
  }
};

Container.propTypes = {
  containerClass: PropTypes.string,
};
