import React, { Component } from 'react';
import { Row, Col, Card, Input, Button, message,Upload } from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import draftToMarkdown from 'draftjs-to-markdown';
import { uploadContentImage } from '../../services/upload';
import { uploadImage } from '../../services/upload';
import { addNotice, getNoticeById } from '../../services/article';
// import '../../assets/css/editor.css';
import './index.less'


const rawContentState = {
	entityMap: { '0': { type: 'IMAGE', mutability: 'MUTABLE', data: { src: 'http://i.imgur.com/aMtBIep.png', height: 'auto', width: '100%' } } },
	blocks: [{ key: '9unl6', text: '', type: 'unstyled', depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} }, { key: '95kn', text: ' ', type: 'atomic', depth: 0, inlineStyleRanges: [], entityRanges: [{ offset: 0, length: 1, key: 0 }], data: {} }, { key: '7rjes', text: '', type: 'unstyled', depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} }]
};

class TextEditor extends Component {
	constructor(props){
		super(props)
	}
	state = {
		editorContent: undefined,
		contentState: rawContentState,
		editorState: '',
		title:'',
		imageUrl:''
	};

	// componentDidMount(){
	// 	const {id} = this.props.match.params
	// 	console.log(id)
	// }


	// getContent = async (id)=>{
	// 	const res = await getNoticeById(id)
	// 	if(res.status === 200){
	// 		console.log(res)
	// 		this.setState({
	// 			title:res.data.title,
	// 			content:res.data.content
	// 		})
	// 	}
	// }

	onEditorChange = editorContent => {
		this.setState({
			editorContent
		});
	};

	clearContent = () => {
		this.setState({
			editorContent: '',
			editorState:'',
			title:'',
			imageUrl:''
		});
	};

	onContentStateChange = contentState => {
		console.log('contentState', contentState);
	};

	onEditorStateChange = editorState => {
		this.setState({
			editorState
		});
	};
	 uploadButton =(
        <div>
            <Button type="text">点击上传</Button>
        </div>
    )

	customRequest = async ({ file }) => {
	    const formData = new FormData()		
	    formData.append('file', file)
	    const res = await uploadImage(formData)
		this.setState({
			imageUrl:res.data
		})
	}

	//保存公告
	saveNotice = async ()=>{
		const { editorContent, title, imageUrl } = this.state
		if(title.length===0 || !editorContent){
			message.error('请输入内容或标题')
			console.log(this.props.history)
			return
		}
		const res = await addNotice({
			title,
			content:draftToHtml(editorContent),
			imageUrl,
		})
		if(res.status===200){
			message.success('发布公告成功')
			this.clearContent()
		}
		
	}
	imageUploadCallBack = file =>{
		return   new Promise( async (resolve, reject) => {
            const formData = new FormData()		
            formData.append('file', file)
            const res = await uploadContentImage(formData)
            if(res.status===200){
                resolve({data: {link: res.data}})
            }else{
                reject({data: {link: res.data}})
            }
			// const xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
			// xhr.open('POST', 'https://api.imgur.com/3/image');
			// const data = new FormData(); // eslint-disable-line no-undef
			// data.append('image', file);
			// xhr.send(data);
			// xhr.addEventListener('load', () => {
			// 	const response = JSON.parse(xhr.responseText);
			// 	resolve(response);
			// });
			// xhr.addEventListener('error', () => {
			// 	const error = JSON.parse(xhr.responseText);
			// 	reject(error);
			// });
		});
    }
	render() {
		const { editorContent, editorState,imageUrl } = this.state;
		return (
			<div className="shadow-radius">
				<div>公告标题：<Input onChange={(e)=>this.setState({title:e.target.value})}></Input></div>
				<div>
					文章封面：
                      <Upload
                        name="image"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        customRequest={this.customRequest}
                    >
                        {imageUrl ? <img src={imageUrl} alt="封面" style={{ width: '200px',height:'100px' }} /> : this.uploadButton}
                    </Upload>
				</div>
				<div className="gutter-example button-demo editor-demo">
					<Row gutter={16} style={{padding:'0 5px'}}>
						<Col className="gutter-row" md={24} >
							<div className="gutter-box">
								<Card title="公告内容" bordered={false}>
									<Editor
										editorState={editorState}
										toolbarClassName="home-toolbar"
										wrapperClassName="home-wrapper"
										editorClassName="home-editor"
										onEditorStateChange={this.onEditorStateChange}
										toolbar={{
											history: { inDropdown: true },
											inline: { inDropdown: false },
											list: { inDropdown: true },
											textAlign: { inDropdown: true },
											image: { 
                                                urlEnabled: true,
                                                uploadEnabled: true,
                                                alignmentEnabled: true,
                                                uploadCallback: this.imageUploadCallBack, 
                                            
                                            }
										}}
										onContentStateChange={this.onEditorChange}
										placeholder="请输入正文~~尝试@哦，有惊喜"
										spellCheck
										// onFocus={() => {
										// 	console.log('focus');
										// }}
										// onBlur={() => {
										// 	console.log('blur');
										// }}
										// onTab={() => {
										// 	console.log('tab');
										// 	return true;
										// }}
										localization={{ locale: 'zh', translations: { 'generic.add': 'Test-Add' } }}
										mention={{
											separator: ' ',
											trigger: '@',
											caseSensitive: true,
											suggestions: [{ text: 'A', value: 'AB', url: 'href-a' }, { text: 'AB', value: 'ABC', url: 'href-ab' }, { text: 'ABC', value: 'ABCD', url: 'href-abc' }, { text: 'ABCD', value: 'ABCDDDD', url: 'href-abcd' }, { text: 'ABCDE', value: 'ABCDE', url: 'href-abcde' }, { text: 'ABCDEF', value: 'ABCDEF', url: 'href-abcdef' }, { text: 'ABCDEFG', value: 'ABCDEFG', url: 'href-abcdefg' }]
										}}
									/>
								</Card>
							</div>
						</Col>
						<Col className="gutter-row" md={8}>
							<Card title="同步转换HTML" bordered={false}>
								<pre>{draftToHtml(editorContent)}</pre>
							</Card>
						</Col>
						<Col className="gutter-row" md={8}>
							<Card title="同步转换MarkDown" bordered={false}>
								<pre style={{ whiteSpace: 'pre-wrap' }}>{draftToMarkdown(editorContent)}</pre>
							</Card>
						</Col>
						<Col className="gutter-row" md={8}>
							<Card title="同步转换JSON" bordered={false}>
								<pre style={{ whiteSpace: 'normal' }}>{JSON.stringify(editorContent)}</pre>
							</Card>
						</Col>
					</Row>
				</div>
				<div className='addNotice'>
				<Button type='primary' onClick={this.saveNotice}>发表文章</Button>
				</div>
			</div>
		);
	}
}

export default TextEditor;
