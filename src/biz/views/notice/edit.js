import { connect } from 'dva';
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { Modal, Tabs } from 'antd';

import { Container } from 'components/layout';
import { InnerEditPage } from 'components/biz';

import NoticeForm from './components/noticeForm';

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

const modelName = 'noticeEdit';

class Page extends InnerEditPage {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    [modelName]: PropTypes.object.isRequired,
  }

  constructor() {
    super();
    this.module = modelName;
  }

  preview = (fieldsValue) => {
    this.props.dispatch({
      type: `${this.module}/preview`,
      payload: fieldsValue
    });
  }

  closePreview = (fieldsValue) => {
    this.props.dispatch({
      type: `${this.module}/closePreview`
    });
  }

  onContentChange = (content) => {
    this.props.dispatch({
      type: `${this.module}/changeContent`,
      payload: content
    });
  }

  render = () => {
    const model = this.props[modelName];

    const { crumbList, fieldErrors, entity, showPreviewModal, content, previewData } = model;

    const containerProps = { crumbList };
    return (
      <Container {...containerProps}>
        <NoticeForm
          { ...model }
          onPreview={ this.preview } onSubmit={ this.save }
          onCancel={ this.cancel } onContentChange={ this.onContentChange } />
        <Modal
          visible={showPreviewModal}
          onCancel={this.closePreview}
          footer={null}
          width={600}
        >
          <div id="previewbox">
            <div id="preview-content">
              <div className="article-title">
                <h1 style={{padding: '0 20px',}}>{previewData.title}</h1>
              </div>
              <div className="article-info">
                <div className="article-info-time">{previewData.publishedAt}</div>
              </div>
              <div className="article-content">
                <div style={{padding: 20}} dangerouslySetInnerHTML={{__html: content}}></div>
              </div>
            </div>
          </div>
        </Modal>
      </Container>
    );
  }
}

export default connect(({ noticeEdit }) => ({ noticeEdit }))(Page);
