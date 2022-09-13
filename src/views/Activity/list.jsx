import React,{ useState, useRef, useEffect, useCallback }from 'react'
import { Input, Button, Space, Popconfirm, Table, Form, Modal, Select, message,InputNumber,Tag } from 'antd';
import {  EditOutlined,UserAddOutlined } from '@ant-design/icons'
import { getActivityList,updateActivity,addMember,deleteMember } from '../../services/activity';
import { verifyStudent } from '../../services/student'
import exportExcel  from '../../utils/exportExcel';

import dayjs from 'dayjs'
import './index.less'
const { Option } = Select;
const { TextArea } = Input;

const Index = () => {

    const [searchParams,setSearchParams] = useState({page:1,size:6,name:''})
    const [activityList,setActivityList] = useState([])
    const [memberList,setMemberList] = useState([])
    const [total,setTotal] = useState(0)
    const [title, setTitle] = useState('新增管理员')
    const [visible, setVisible] = useState(false)
    const [visible2, setVisible2] = useState(false)
    const [visible3, setVisible3] = useState(false)
    const [currentActivity,setCurrentActivity] = useState({})
    const formRef=useRef()
    const participantRef = useRef()
    const [ studentName, setStudentName ] = useState('')

    const getList = useCallback(
        async ()=>{
            const res =await getActivityList(searchParams)
            if(res.status===200){
                setTotal(res.data.total)
                setActivityList(res.data.list)
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
        setSearchParams({...searchParams,name:value})
    }
    
    const updateActi = async ()=>{
            const values = await formRef.current.validateFields()
            const res=await updateActivity({...values,id:currentActivity.id})
            if(res.status===200){
                 message.success('修改成功',0.8)
                 getList()
                setVisible(false)
        }
    }

    const addUser = async ()=>{
        const values = await participantRef?.current.validateFields()
        const res = await addMember({...values,activity_id:currentActivity.id})
        if(res.status===200){
            message.success('新増参与者成功',0.9)
            setVisible2(false)
            getList()
        }
    }

    const edit = async (record)=>{
        setTitle('编辑活动信息')
        setCurrentActivity(record)
        setVisible(true)
    }

    useEffect(() => {
        if(formRef.current)
        formRef.current.setFieldsValue(currentActivity)
    }, [currentActivity]);

    const showMemberList = (record) =>{
        setCurrentActivity(record)
        setMemberList(record.memberList)
        setVisible3(true)
    }

    const delMember = async (member) =>{
        const { member_number } = member
        const res = await deleteMember({member_number,activity_id:currentActivity.activity_id})
        if(res.status===200){
            message.success('删除成功',0.9)
        }
    }
    
  //验证学号是否正确
   const checkNumber = (value) => { // 这个是rules自定义的验证方法
    return new Promise((resolve, reject) => {  // 返回一个promise
      verifyStudent({ number: value }).then(res => { // 这个是后台接口方法
        if (res.status === 200) {
          resolve(res.data)
        }
      }).catch(error => {
        reject(error)
      })
    })
}

    const columns=[
        {
            title:'活动名称',
            dataIndex:'activity_name',
            key:'activity_name'
        },
        {
            title:'活动说明',
            dataIndex:'activity_message',
            key:'activity_message'
        },
        {
            title:'活动地点',
            dataIndex:'activity_address',
            key:'activity_address'
        },
        {
            title:'活动人数',
            dataIndex:'activity_count',
            render:(text,record)=>{
              return <div>
                  {record.memberList.length}/{text} <Tag  onClick={()=>showMemberList(record)} color="#87d068">查看</Tag>
                  </div>
            }
        },
        {
          title:'活动时间',
          ellipsis:true,
          render:(text,record)=>{
              return `${dayjs(record.date).format('YYYY-MM-DD')} ${record.time}`
          }
       },
        {
            title:'操作',
            key:'action',
            render:(text,record)=>{
                return(
                    <Space size="middle">
                        <Button type='primary' shape="circle" icon={<EditOutlined />} onClick={()=>edit(record)}></Button>
                        <Button type="success" shape="circle"   icon={<UserAddOutlined onClick={()=>{setCurrentActivity(record);setVisible2(true)}}/>}   />           
                    </Space>
                )
            }
        }
    ]
    return (
        <div>
            <div className='search_area'>
                <Input.Search allowClear onSearch={onSearch} placeholder='请输入活动名称'></Input.Search>
            </div>
            <Table dataSource={activityList} columns={columns} rowKey="id" 
             onChange={(page)=>{changePage(page)}}
                pagination={{
                total:total,
                rowKey:"id",
                showSizeChanger: true, 
                showQuickJumper: true,
                // pageSize:searchParams.size,
                current:searchParams.page,
                showTotal:((total) => {
                    return `共 ${total} 条`;
                  })}}/>;

                <div className="dialog">
                <Modal title={title} visible={visible}  onCancel={()=>setVisible(false)}  onOk={updateActi} okText='确认' cancelText='取消'>
                <Form ref={formRef} labelCol= {{span: 4}} wrapperCol= {{ span: 20 }}>
                    <Form.Item
                    label="活动名称"
                    name="activity_name"
                    validateTrigger="onBlur"
                    rules={[{ required: true, message: '请输入活动名称' }]}>
                        <Input />
                    </Form.Item>
 
                    <Form.Item
                    label="活动说明"
                    name="activity_message"
                    validateTrigger="onBlur"
                    rules={[{ required: true, message: '请输入活动说明' }]}>
                        <TextArea/>
                    </Form.Item>
                    <Form.Item
                    label="活动人数"
                    name="activity_count"
                    rules={[{ required: true, message: '请输入活动人数' }]}>
                       <InputNumber/>
                    </Form.Item>    
                </Form>
                </Modal>
                <Modal title='新増参与者' visible={visible2}  onCancel={()=>setVisible2(false)} onOk={addUser}   okText='确认' cancelText='取消'>
                    <Form  ref={participantRef} labelCol= {{span: 4}} wrapperCol= {{ span: 20 }}>
                    <Form.Item
                    label="学号"
                    name="member_number"
                    validateTrigger="onBlur"
                    rules={[
                        { required: true, message:'请输入学号' },
                        {len:10,message:'学号长度为10位'},
                        {whitespace:true,message:'不能包含空字符'},
                      ]}>
                        <Input placeholder='输入学号' />
                    </Form.Item>
                    <Form.Item
                    label="姓名"
                    name="member_name"
                    validateTrigger="onBlur"
                    rules={[
                        { required: true,  message:'请输入姓名' },
                        {max:5,message:'姓名最长5个字符'},
                        {type:'string', whitespace:false,message:'不能包含空字符'},
                      ]}>
                        <Input/>
                    </Form.Item> 
                    </Form>
                </Modal>
                <Modal title='参与者列表' visible={visible3} okText="导出参与者名单" onOk={()=>exportExcel({activity_name:currentActivity.activity_name,memberList},'参与者信息表')} onCancel={()=>setVisible3(false)} cancelText='取消'>
                    { memberList.map((item)=>{
                        return (
                                <Tag  onClose={(e)=>e.preventDefault()}>{item.member_number}{item.member_name}</Tag>
                        )
                    }) }
                </Modal>
            </div>
        </div>
    );
}

export default Index;
