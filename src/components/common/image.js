/**
 * 缩略图组件
 */
import React, { PropTypes, Component } from 'react';
import { Modal, Button, Icon } from 'antd';
import './image.less';

export default class Image extends Component {

  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    src: PropTypes.string.isRequired,
    fullSrc: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { previewVisible: false };
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = () => {
    this.setState({
      previewImage: this.props.fullSrc,
      previewVisible: true
    });
  }

  render () {
    let { src, width, height, fullSrc, showStatus = 1 } = this.props;
    let { previewVisible, previewImage } = this.state;
    return (
      <div className="app-image" style={{width, height}}>
        <img className="app-image-body" src={ src } width={ width } height={ height } />
        {
          showStatus == 0 && <span className="app-image-status-tag">无效</span>
        }
        <span className="app-image-actions-cover">
          <Icon className="app-image-actions-cover-btn last" title="查看大图" onClick={this.handlePreview} type="arrows-alt" />
        </span>
        <Modal className="app-image-pop-previewer" width={900} visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="预览" src={previewImage} />
        </Modal>
      </div>
    );
  }
}
