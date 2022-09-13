import React,{ useState, useRef, useEffect, useCallback }from 'react'
import { Input, Button, Upload,Image,InputNumber, Space, Popconfirm, Table, Tag, Form, Modal, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined  } from '@ant-design/icons'
import { getRoomList, addRoom, updateRoom, deleteRoom } from '../../services/room'
import { uploadImage } from '../../services/upload';
import academyList from './academyList';
import exportExcel  from '../../utils/exportExcel';
import './index.less'
const { Option } = Select;

const Index = () => {

    const [searchParams,setSearchParams] = useState({name:'',academy_name:'',page:1,size:6})
    const [roomList,setRoomList] = useState([])
    const [total,setTotal] = useState(0)
    const [title, setTitle] = useState('新増活动室')
    const [visible, setVisible] = useState(false)
    const [currentRoom, setcurrentRoom] = useState({})
    const [imageUrl,setImageUrl] = useState('')
    const formRef=useRef()

    const uploadButton =(
        <div>
            <Button type="text">点击上传</Button>
        </div>
    )
    

    const normFile = (e) => { 
        if (Array.isArray(e)) {
          return e;
        }
      
        return e && e.fileList;
      };
    const customRequest = async ({ file }) => {
	    const formData = new FormData()		
	    formData.append('file', file)
	    const res = await uploadImage(formData)
	    setImageUrl(res.data)
	}
    const getList = useCallback(
        async ()=>{
            const res =await getRoomList(searchParams)
            if(res.status===200){
                setTotal(res.data.total)
                setRoomList(res.data.list)
            }
        },
        [searchParams]
    )
    
    useEffect(() => {
       getList()
    }, [searchParams]);

    const changePage = (page)=>{
        const { current, pageSize} = page
        setSearchParams({...searchParams,page:current,size:6})
    }

    const onSearch = (value)=>{
        setSearchParams({...searchParams,name:value})
    }
    
    const addnewRoom = async ()=>{
        const values = await formRef.current.validateFields()
        if(title==='新増活动室'){
            const res = await addRoom({...values,image:imageUrl})
            if(res.status===200){
                message.success('新増成功',0.8)
                getList()
                setVisible(false)
            }
        }
        if(title==='编辑活动室'){
            const res2 = await updateRoom({...values,id:currentRoom.id,image:imageUrl})
            if(res2.status===200){
                message.success('修改成功',0.8)
                getList()
                setVisible(false)
            }
        }
        
    }

    const edit = async (record)=>{
        setTitle('编辑活动室')
        setVisible(true)
        setcurrentRoom(record)
        setImageUrl(record.image)
    }

    useEffect(() => {
        if(formRef.current)
        formRef.current.setFieldsValue(
            currentRoom
        )
    }, [currentRoom])

    const delRoom =  async (record) => {
        const res = await deleteRoom({id:record.id})
        if(res.status===200){
            getList()
            message.success('删除成功',0.8)
        }
    }

    const showDialog = ()=>{
        setImageUrl('')
        setVisible(true)
        setTitle('新増活动室')
        if(formRef.current){
            formRef.current.resetFields()
        }
    }

    const handleChange =(value)=>{
        setSearchParams({...searchParams,academy_name:value})
    }
    const columns=[
        {
            title:'图片',
            dataIndex:'image',
            key:'imgage',
            render:(text,record)=>{
                return (
                    <Image
                    width={200}
                    style={{width:'100%',height:'50px',objectFit:'cover'}}
                    src={text}
                  />
                )
            }
        },
        {
            title:'名称',
            dataIndex:'name',
            key:'name'
        },
        {
            title:'简介',
            dataIndex:'message',
            key:'message',
        },
        {
            title:'容纳人数',
            dataIndex:'count',
            key:'count'
        },
        {
            title:'所属书院',
            dataIndex:'academy_name',
            key:'academy_name'
        },
        {
            title:'状态',
            dataIndex:'state',
            key:'state',
            render:(text,record)=>{
                return (
                    <span>
                        {text===0?<Tag color="#87d068">正常</Tag>:<Tag color="red">停用</Tag>}
                    </span>
                )
            }
        },
        {
            title:'操作',
            key:'action',
            render:(text,record)=>{
                return(
                    <Space size="middle">
                        <Button type='primary' shape="circle" icon={<EditOutlined />} onClick={()=>edit(record)}></Button>
                        <Popconfirm placement="top" title={'确认删除该数据吗？'}  okText="确认"   onConfirm={(e)=>delRoom(record)}  cancelText="取消">
                            <Button type="danger" shape="circle"  icon={<DeleteOutlined />}   />
                        </Popconfirm>            
                    </Space>
                )
            }
        }
    ]
    return (
        <div>
            <div className='search_area'>
            <Space>
                <Input.Search allowClear onSearch={onSearch} placeholder='请输入关键字'></Input.Search>
                <Button type="primary" icon={<PlusOutlined />} onClick={()=>showDialog()} >新增</Button>
                <Select 
                    showSearch
                    allowClear
                    placeholder='选择书院'
                    style={{width:'200px'}}
                    // value={searchParams.academy_name}
                    onChange={(value)=>{handleChange(value)}}>
                    { academyList.map((item,index)=>{
                        return <Option value={item.value} key={index}>{item.label}</Option>
                    })}
                </Select>
                <Button icon={<DownloadOutlined />} onClick={()=>exportExcel(roomList,'活动室信息表')}>导出数据</Button>
            </Space>
            </div>
            <Table dataSource={roomList} align="center" columns={columns}
                rowKey="id" 
                onChange={(page)=>{changePage(page)}}
                pagination={{
                total:total,
                showQuickJumper: true,
                pageSize:searchParams.size,
                current:searchParams.page,
                showTotal:((total) => {
                    return `共 ${total} 条`;
                  })}}/>;

                <div className="dialog">
                <Modal title={title} visible={visible}  onCancel={()=>setVisible(false)}  onOk={addnewRoom} okText='确认' cancelText='取消'>
                <Form ref={formRef} labelCol= {{span: 4}} wrapperCol= {{ span: 20 }}>
                    <Form.Item
                    label="活动室图片"
                    valuePropName="fileList" 
                    getValueFromEvent={normFile}                 
                    >
                      <Upload
                        name="image"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        customRequest={customRequest}
                    >
                        {imageUrl ? <img src={imageUrl} alt="活动室图片" style={{ width: '200px',height:'100px' }} /> : uploadButton}
                    </Upload>
                    </Form.Item>
 
                    <Form.Item
                    label="名称"
                    name="name"
                    validateTrigger="onBlur"
                    rules={[{ required: true, message: '请输入活动室名称'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                    label="简介"
                    name="message"
                    rules={[{ required: true, message: '请输入简介' }]}>
                       <Input/>
                    </Form.Item>
                    <Form.Item
                    label="容纳人数"
                    name="count"
                    rules={[
                        { required: true, message:'请输入活动人数' },
                        { type:"number" ,min:1,message:'人数不能为0'}
                    ]}
                    >
                        <InputNumber min={1}/>
                    </Form.Item>
                    <Form.Item
                    label="所属书院"
                    name="academy_name"
                    rules={[{required: true, message: '请选择所属书院'}]}
                    >
                         <Select>
                            { academyList.map((item)=>{
                                return <Option value={item.value} key="index">{item.label}</Option>
                            })}
                         </Select>
                    </Form.Item>
                    <Form.Item
                        label="状态"
                        name="state"
                        rules={[{required: true, message:'请选择状态'}]}
                        >
                           <Select
                           placeholder='状态'>
                               <Option value={0}>正常</Option>
                               <Option value={1}>停用</Option>
                           </Select>
                    </Form.Item>
                </Form>
                </Modal>
            </div>
        </div>
    );
}

export default Index;
