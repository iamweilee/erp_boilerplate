import React, { PropTypes, Component } from 'react';
import { Upload, message, Icon, Radio, Button } from 'antd';

import { EXCEL_UPLOAD_URL } from 'common/global/constant';

import _ from 'underscore';

import './imageUploader.less';

class ExcelUploader extends Component {

  constructor(props) {
    super(props);
    let state = this.setStateFromProps(props);
    this.state = { fileList: [], ...state };
  }

  componentWillReceiveProps(nextProps) {
    let state = this.setStateFromProps(nextProps);
    this.setState({ ...state });
  }

  setStateFromProps(props) {
    let { action } = props;
    action = action || EXCEL_UPLOAD_URL;
    return { action };
  }

  fireChange = () => {
    let { fileList } = this.state;
    this.props.onChange(fileList);
  }

  changeHandler = (info) => {
    let { fileList, file } = info;
    const { status, name, response, uid } = file;

    if (status === 'done' && response.success) {
      message.success(`${name}上传成功！`);
      this.setState({ fileList }, this.fireChange);
    }
    else if ((status === 'done' && !response.success) || status === 'error') {
      message.error(`${name}上传失败：${response.msg}`);
      // 去掉失败的file
      fileList = _.filter(fileList, file => file.uid !== uid);
      this.setState({ fileList }, this.fireChange);
    }
    else {
      this.setState({ fileList: info.fileList });
    }
  }

  onRemove = (uid) => {
    return () => {
      this.remove(uid);
    }
  }

  buildItem = (fileInfo, index) => {
    let { name, percent, status, response, uid } = fileInfo;

    let className = `ant-upload-list-item ant-upload-list-item-${status}`;
    let isUploading = status === 'uploading';
    let isDone = status === 'done';
    return (
      <div className={className} key={index + '_' + name}>
        <div className="ant-upload-list-item-info">
          <span>
            {
              isUploading && <div className="ant-upload-list-item-uploading-text">文件上传中</div>
            }
            {
              isDone &&
              <span>
                <i className="anticon anticon-paper-clip"></i>
                <span className="ant-upload-list-item-name" title={name} >{name}</span>
              </span>
            }
          </span>
        </div>
        {
          isUploading &&
          <div className="ant-upload-list-item-progress">
            <div className="ant-progress ant-progress-line ant-progress-status-success">
              <div>
                <div className="ant-progress-outer">
                  <div className="ant-progress-inner">
                    <div className="ant-progress-bg" style={{ width: percent + '%', height: 2 }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        {
          (isDone || isUploading) &&
          <i title="删除文件" className="anticon anticon-cross" onClick={this.onRemove(uid)}></i>
        }
      </div>
    );
  }

  buildUploadList = (files) => {
    return files.map((file, index) => {
      return this.buildItem(file, index);
    });
  }

  remove = (uid) => {
    this.setState({ fileList: [] }, this.fireChange);
  }

  render = () => {
    let { fileList, action } = this.state;
    let { viewList } = this.props;

    let finalList = fileList;
    if (viewList && viewList.length && fileList.length === 0) {
      finalList = viewList;
    }

    const uploadProps = {
      name: this.props.name || 'file',
      multiple: false,
      showUploadList: false,
      fileList: [...finalList],
      action: action,
      onChange: this.changeHandler,
      headers: { 'X-Requested-With': null },
    };

    let canUpload = finalList.length === 0 || (finalList.length === 1 && finalList[0].status !== 'done');

    return (
      <div className="axg-img-uploader">
        { canUpload && <Upload {...uploadProps}>
            <Button><Icon type="upload" />上传模板</Button>
          </Upload>
        }
        <div className="ant-upload-list ant-upload-list-text">
        { this.buildUploadList(finalList) }
        </div>
      </div>
    );
  }
}

export default ExcelUploader;
