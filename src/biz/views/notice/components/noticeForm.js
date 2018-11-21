import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import { Button, Form, Select, Input, InputNumber, Modal, DatePicker } from 'antd';

import FormHandle from 'components/decorator/formHandle';
import InputFormField from 'components/common/inputFormField';
import ImageUploader from 'components/common/imageUploader';

import 'static/js/simditor/styles/simditor.css';
import 'static/js/simditor-html/styles/simditor-html.css';

import { IMAGE_COMMON_SIZE} from 'common/global/constant';
import dynamicConst from 'common/dynamicConst';

// import blankUploadImage from 'static/img/avatar_company.png';

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

function disabledDate(current) {
  // Can not select days after today
  return current && current.valueOf() > Date.now();
}

@FormHandle
class Page extends React.Component {

  onContentChange = (e) => {
    this.props.onContentChange(e.target.getValue());
  }

  componentWillUpdate = (props) => {
    if (!this.editor) {
      let textbox = ReactDOM.findDOMNode(this.refs['richText']);
      this.editor = new Simditor({
        textarea: $(textbox),
        toolbar: [
          'title',
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'fontScale',
          'color',
          '|',
          'ol',
          'ul',
          'indent',
          'outdent',
          'alignment',
          '|',
          'hr',
          'blockquote',
          'table',
          'link',
          'image'
        ],
        //defaultImage: blankUploadImage,
        imageButton: 'external',
        upload: {
          url: `${dynamicConst.getItem('uploadUrl')}`, //文件上传的接口地址
          fileKey: 'file', //服务器端获取文件数据的参数名
          connectionCount: 1,
          leaveConfirm: '正在上传文件'
        },
      });
      this.editor.on('valuechanged', this.onContentChange);
      this.editor.uploader.on('uploadsuccess', (function(_this){
        return (e, file, result) => {
          let $img = file.img;
          let {sKey, sExt, iHeight, iWidth} = result.file;
          let url =  `${dynamicConst.getItem('viewUrl')}/${sKey}/${IMAGE_COMMON_SIZE}.${sExt}`;
          let imageButton = _this.findButton('image');
          let popover = imageButton.popover;
          imageButton.loadImage($img, url, function() {
            popover.width = iWidth;
            popover.height = iHeight;
            popover.widthEl.val(iWidth);
            popover.heightEl.val(iHeight);
            popover.editor.trigger('valuechanged');
          });
          popover.srcEl.prop('disabled', false);
          return popover.srcEl.val(url);
        }
      })(this.editor.toolbar));
    }
  }

  componentWillReceiveProps(nextProps) {
    let originContent = this.props.entity.content;
    let newContent = nextProps.entity.content;

    if (originContent !== newContent && this.editor) {
      this.editor.setValue(newContent);
    }
  }

  preview = () => {
    this.props.form.validateFields(
      { force: true },
      (err, values) => {
        if (!err) {
          this.props.onPreview(values);
        }
      },
    );
  }

  render = () => {
    const { getFieldDecorator } = this.props.form;
    let { entity, id, categoryList } = this.props;

    return (
      <Form>
        <InputFormField
          getFieldDecorator={getFieldDecorator}
          type="datepickerTime"
          label="发布时间"
          field="publishedAt"
          disabledDate={disabledDate}
          options={{noInit: true}}
          entity={entity}
          style={{ width: 120 }}
          options={{rules: [{ required: true, message: '请选择一个发布时间' }]}} />
        <InputFormField
          getFieldDecorator={getFieldDecorator}
          style={{ width: '200px' }}
          label="文章标题"
          field="title"
          required={true}
          entity={entity}
          options={{rules: [{ required: true, message: '请填写文章标题' }]}}/>
        <InputFormField
          getFieldDecorator={getFieldDecorator}
          label="资讯栏目"
          field="categoryId"
          required={true}
          entity={entity}
          datasource={categoryList}
          type="select"
          style={{ width: 120 }}
          options={{rules: [{ required: true, message: '请选择一个资讯栏目' }]}} />
        <InputFormField
          getFieldDecorator={getFieldDecorator}
          style={{ width: '200px' }}
          label="作者/来源"
          field="source"
          required={true}
          entity={entity}
          options={{rules: [{ required: true, message: '请添加作者/来源' }, { max: 10, message: '最多10个字符!' }]}}/>
        <FormItem label="封面图">
          {
            getFieldDecorator('icon', {
              initialValue: entity ? entity.icon : [],
            })(
              <ImageUploader max={1}/>
            )
          }
        </FormItem>
        <FormItem label="正文">
          <textarea className="form-control" ref='richText' rows="30"></textarea>
        </FormItem>
        <FormItem className="form-action-button">
          <Button type="primary" onClick={this.props.handleSubmit} size="large">保存</Button>
          <Button type="primary" onClick={this.preview} size="large">预览</Button>
          <Button className="button-like-link" type="default" onClick={this.props.handleCancel} size="large">取消</Button>
        </FormItem>
      </Form>
    );
  }
}

export default Page;
