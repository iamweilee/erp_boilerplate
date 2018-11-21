import React, { PropTypes, Component } from 'react';
import { Upload, message, Icon, Radio, Button, Anchor } from 'antd';

import { IMAGE_THUMB_SIZE, IMAGE_COMMON_SIZE, MAX_IMAGE_NUMBER } from 'common/global/constant';
import dynamicConst from 'common/dynamicConst';

import _ from 'underscore';

import './imageUploader.less';

const Dragger = Upload.Dragger;
const { Link } = Anchor;

function getThumbUrl(imgKey, imgExt) {
  if (imgKey) {
    return `${dynamicConst.getItem('viewUrl')}/${imgKey}/${IMAGE_THUMB_SIZE}.${imgExt}`;
  }

  return '';
}

function getFullUrl(imgKey, imgExt) {
  if (imgKey) {
    return `${dynamicConst.getItem('viewUrl')}/${imgKey}/${IMAGE_COMMON_SIZE}.${imgExt}`;
  }

  return '';
}


class ImageUploader extends Component {

  constructor(props) {
    super(props);
    /**
     *  [
     *    {
     *      "id": 1,
     *      "picUrl": "http://tupiandizhi.png",
     *      "isCover": 1 // 是否是封面
     *    },
     *    ...
     *  ]
     */
    let state = this.setStateFromProps(props);
    this.state = { ...state };
  }

  componentWillReceiveProps(nextProps) {
    let state = this.setStateFromProps(nextProps);
    this.setState({ ...state });
  }

  setStateFromProps(props) {
    let { action, value, max } = props;
    max = max ? parseInt(max) : MAX_IMAGE_NUMBER;
    value = value || [];
    action = action || `${dynamicConst.getItem('uploadUrl')}`;
    return { fileList: [...value], action, ifFull: value.length >= max };
  }

  fireChange = () => {
    let { fileList } = this.state;
    this.props.onChange(fileList);
  }

  buildItem = (fileInfo, index) => {
    let { cover } = this.props;
    let { name, percent, status, response, isCover, uid } = fileInfo;
    let { sExt, sKey } = status === 'done' ? response.file : {};
    let thumbUrl = getThumbUrl(sKey, sExt);
    let fullUrl = getFullUrl(sKey, sExt);

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
              isDone && <img  className="ant-upload-list-item-thumbnail" src={thumbUrl} alt={name} />
            }
            { isDone && isCover && <div className="app-image-cover-tag">封面</div> }
            {
              isDone && <span className="ant-upload-list-item-name" title={name}>{name}</span>
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
          (isDone || isUploading) && !this.props.readonly &&
            <span className="ant-upload-list-item-actions">
              { isDone && cover && !isCover && <Button title="加封面" className="cover" onClick={this.onChangeCover(uid)}>设置为封面</Button> }
              { isDone && <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="preview"><Icon type="eye" /></a> }
              <Button title="删除文件" className="delete" onClick={this.onRemove(uid)}><Icon type="close-circle" /></Button>
            </span>
        }
      </div>
    );
  }

  buildUploadList = (files) => {
    return files.map((file, index) => {
      return this.buildItem(file, index);
    });
  }

  changeHandler = (info) => {
    let { fileList, file } = info;
    let { max } = this.props;
    max = max ? parseInt(max) : MAX_IMAGE_NUMBER;
    const { status, name, response, uid } = file;

    if (status === 'done' && !response.code) {
      message.success(`${name}上传成功！`);
      this.setState({ fileList, ifFull: fileList.length >= max }, this.fireChange);
    }
    else if ((status === 'done' && response.code) || status === 'error') {
      message.error(`${name}上传失败：${response.file}`);
      // 去掉失败的file
      fileList = _.filter(fileList, file => file.uid !== uid);
      this.setState({ fileList }, this.fireChange);
    }
    else {
      this.setState({ fileList: info.fileList });
    }
  }

  onChangeCover = (uid) => {
    return () => {
      this.changeCover(uid);
    }
  }

  changeCover = (uid) => {
    let fileList = this.state.fileList.map(file => {
      let isCover = 0;
      if (file.uid === uid) {
        isCover = 1;
      }
      return {
        ...file,
        isCover
      };
    });

    this.setState({ fileList }, this.fireChange);
  }

  onRemove = (uid) => {
    return () => {
      this.remove(uid);
    }
  }

  remove = (uid) => {
    let deletedFile;
    let { max, cover } = this.props;
    max = max ? parseInt(max) : MAX_IMAGE_NUMBER;
    let fileList = this.state.fileList.reduce(
      (fileList, file) => {
        if (file.uid !== uid) {
          fileList.push(file);
        }
        else {
          deletedFile = file;
        }

        return fileList;
      },
      []
    );
    // 如果封面被删了，那就默认设置第一张图是封面
    if (cover && deletedFile.isCover && fileList[0]) {
      fileList[0].isCover = true;
    }
    this.setState({ fileList, ifFull: fileList.length >= max }, this.fireChange);
  }

  render = () => {
    let { fileList, action, ifFull } = this.state;
    let { readonly } = this.props;
    const uploadProps = {
      name: this.props.name || 'file',
      multiple: true,
      showUploadList: false,
      fileList: [...fileList],
      action: action,
      onChange: this.changeHandler,
      headers: { 'X-Requested-With': null },
    };

    let notFinishedItem = fileList.filter(item => item.status !== 'done');

    let notFinished = !!notFinishedItem.length;

    let canUpload = !ifFull || notFinished;

    return (
      <div className="app-img-uploader">
        { canUpload && !readonly && <Dragger {...uploadProps}>
          <p className="ant-upload-text">将图片拖拽至此或点此上传</p>
        </Dragger> }
        <div className="ant-upload-list ant-upload-list-picture-card">
        { this.buildUploadList(this.state.fileList) }
        </div>
      </div>
    );
  }
}

export default ImageUploader;
