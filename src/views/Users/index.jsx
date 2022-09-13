import React,{ useState, useRef, useEffect, useCallback }from 'react'
import { Input, Button, Space, Popconfirm, Table, Form, Modal, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { list, addSysUser, editUser, deleteUser } from '../../services/systemUser'
import dayjs from 'dayjs'
import './index.less'
const { Option } = Select;

const Index = () => {

    const [searchParams,setSearchParams] = useState({page:1,size:6,username:''})
    const [userList,setUserList] = useState([])
    const [total,setTotal] = useState(0)
    const [title, setTitle] = useState('新增管理员')
    const [visible, setVisible] = useState(false)
    const [currentUser,setCurrentUser] = useState({})
    const formRef=useRef()

    const getList = useCallback(
        async ()=>{
            const res =await list(searchParams)
            if(res.status===200){
                setTotal(res.data.total)
                setUserList(res.data.list)
            }
        },
        [searchParams]
    )
    
    useEffect(() => {
       getList()
    }, [getList]);

    const changePage = (page)=>{
        const { current, pageSize} = page
        setSearchParams({...searchParams,page:current,size:6})
    }

    const onSearch = (value)=>{
        setSearchParams({...searchParams,username:value})
    }
    
    const addUser = async ()=>{
        const values = await formRef.current.validateFields()
        if(title==='新增管理员'){
            const res = await addSysUser(values)
            if(res.status===200){
                message.success('新増成功',0.8)
                setSearchParams({...searchParams,page:1,limit:5})
                setVisible(false)
            }
        }else{
            const res2=await editUser(values)
            if(res2.status===200){
                 message.success('修改成功',0.8)
                 getList()
                setVisible(false)
            }
        }
        
    }

    const edit = async (record)=>{
        if(record.username==='admin')return message.warning('admin不能随意修改',0.9) 
        setTitle('编辑管理员')
        setCurrentUser(record)
        setVisible(true)
    }

    useEffect(() => {
        if(formRef.current)
        formRef.current.setFieldsValue(currentUser)
    }, [currentUser]);
    const delUser = async (record) => {
        const {username} = record
        if(username==='admin') return message.warning('admin不能随意修改',0.9) 
        const res = await deleteUser(username)
        if(res.status===200){
        message.success('删除成功',0.8)
        }
        setSearchParams({...searchParams,page:1,size:5})   
    }

    const showDialog = ()=>{
        setVisible(true)
        setTitle('新增管理员')
        if(formRef.current){
            setTimeout(() => {
                formRef.current.resetFields()
            }, 0);
        }
    }
    const columns=[
        {
            title:'用户名',
            dataIndex:'username',
            key:'username'
        },
        {
            title:'密码',
            dataIndex:'password',
            key:'phone'
        },
        {
            title:'角色权限',
            dataIndex:'role',
            render:(text,record)=>{
                return(
                <span>
                    {text===1?'超级管理员':'普通管理员'}
                </span>
                )
            }
        },
        {
            title:'创建时间',
            dataIndex:'createAt',
            key:'createAt',
            render:(text,record)=>{
                return <span>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</span>
            }
        },
        {
            title:'修改时间',
            dataIndex:'updateAt',
            key:'updateAt',
            render:(text,record)=>{
                return <span>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</span>
            }
        },
        {
            title:'操作',
            key:'action',
            render:(text,record)=>{
                return(
                    <Space size="middle">
                        <Button type='primary' shape="circle" icon={<EditOutlined />} onClick={()=>edit(record)}></Button>
                        <Popconfirm placement="top" title={'确认删除该用户吗？'}  okText="确认" onConfirm={(e)=>delUser(record)}  cancelText="取消">
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
                <Input.Search allowClear onSearch={onSearch} placeholder='请输入用户名'></Input.Search>
                <Button type="primary" icon={<PlusOutlined />} onClick={()=>showDialog()} >新增</Button>
            </div>
            <Table dataSource={userList} columns={columns} rowKey="id" 
             onChange={(page)=>{changePage(page)}}
            pagination={{
                total:total,
                showSizeChanger: true, 
                showQuickJumper: false,
                pageSize:searchParams.size,
                current:searchParams.page,
                showTotal:((total) => {
                    return `共 ${total} 条`;
                  })}}/>;
                <div className="dialog">
                <Modal title={title} visible={visible}  onCancel={()=>setVisible(false)}  onOk={addUser} okText='确认' cancelText='取消'>
                <Form ref={formRef} labelCol= {{span: 4}} wrapperCol= {{ span: 20 }}>
                    <Form.Item
                    label="用户名"
                    name="username"
                    validateTrigger="onBlur"
                   
                    rules={[{ required: true, message: '请输入用户名' }]}>
                        <Input  disabled={title==='编辑区域管理员'}/>
                    </Form.Item>
 
                    <Form.Item
                    label="密码"
                    name="password"
                    validateTrigger="onBlur"
                    rules={[{ required: true, message: '请输入密码' }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                    label="身份"
                    name="role"
                    rules={[{ required: true, message: '请选择身份' }]}>
                       <Select
                            placeholder="选择身份"
                        >
                            <Option value={0} key="0">普通管理员</Option> 
                            <Option value={1} key="1">超级管理员</Option> 
                        </Select>
                    </Form.Item>
                </Form>
                </Modal>
            </div>
        </div>
    );
}

export default Index;
