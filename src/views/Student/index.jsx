import React,{ useState, useRef, useEffect, useCallback }from 'react'
import { Input, Button, Cascader, Space, Popconfirm, Table, Tag, Form, Modal, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined  } from '@ant-design/icons'
import { getStudentList, addStudents, updateStudent, deleteStudent } from '../../services/student'
import exportExcel  from '../../utils/exportExcel';
import classes from './classes'
import roomList from './roomList'
const { Option } = Select;

const Index = () => {

    const [searchParams,setSearchParams] = useState({keyWords:'',page:1,size:6})
    const [student,setStudent] = useState([])
    const [total,setTotal] = useState(0)
    const [title, setTitle] = useState('新増学生')
    const [visible, setVisible] = useState(false)
    const [currentStudent, setCurrentStudent] = useState({})
    const formRef=useRef()

    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
          <Select style={{ width: 70 }}>
            <Option value="86" selected>+86</Option>
            <Option value="87">+87</Option>
          </Select>
        </Form.Item>
      );

    const getList = useCallback(
        async ()=>{
            const res =await getStudentList(searchParams)
            if(res.status===200){
                setTotal(res.data.total)
                setStudent(res.data.list)
            }
        },
        [searchParams]
    )
    
    useEffect(() => {
       getList()
    }, [searchParams,getList]);

    const changePage = (page)=>{
        const { current, pageSize} = page
        setSearchParams({...searchParams,page:current,size:6})
    }

    const onSearch = (value)=>{
        setSearchParams({...searchParams,keyWords:value})
    }
    
    const addnewStudent = async ()=>{
        const values = await formRef.current.validateFields()
        const newclasses = values.classes[0] +values.classes[1]
        const newroom = values.room[0] + '-'+ values.room[1] + values.room[2]
        if(title==='新増学生'){
            const res = await addStudents({...values,classes:newclasses,room:newroom})
            if(res.status===200){
                message.success('新増成功',0.8)
                getList()
                setVisible(false)
            }
        }
        if(title==='编辑学生'){
            const res2 = await updateStudent({...values,classes:newclasses,room:newroom})
            if(res2.status===200){
                 message.success('修改成功',0.8)
                 getList()
                setVisible(false)
            }
        }
        
    }

    const edit = async (record)=>{
        setTitle('编辑学生')
        setVisible(true)
        setCurrentStudent(record)
    }

    useEffect(() => {
        const { room } = currentStudent
        if(formRef.current)
        formRef.current.setFieldsValue({
            ...currentStudent,
            classes:[currentStudent['class'].slice(0,-3),currentStudent['class'].slice(-3,-1)],
            room:[room.split('-')[0],room.split('-')[1].slice(0,1),room.split('-').slice(1)]
        })
    }, [currentStudent])

    const delStudent =  async (record) => {
        const res = await deleteStudent({number:record.number})
        if(res.status===200){
            getList()
            message.success('删除成功',0.8)
        }
    }

    const showDialog = ()=>{
        setVisible(true)
        setTitle('新増学生')
        if(formRef.current){
            formRef.current.resetFields()
        }
    }
    const columns=[
        {
            title:'学号',
            dataIndex:'number',
            key:'number'
        },
        {
            title:'姓名',
            dataIndex:'name',
            key:'name'
        },
        {
            title:'性别',
            dataIndex:'sex',
            key:'sex',
            render:(text,record)=>{
                return (
                    <span>{text===1?'男':'女'}</span>
                )
            }
        },
        {
            title:'班级',
            dataIndex:'class',
            key:'class'
        },
        {
            title:'电话',
            dataIndex:'phone',
            key:'phone'
        },
        {
            title:'寝室',
            dataIndex:'room',
            key:'room'
        },
        {
            title:'状态',
            dataIndex:'state',
            key:'state',
            render:(text,record)=>{
                return (
                    <span>
                        {text===0?<Tag color="#2db7f5">在校</Tag>:<Tag color="red">离校</Tag>}
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
                        <Popconfirm placement="top" title={'确认删除该用户吗？'}  okText="确认"   onConfirm={(e)=>delStudent(record)}  cancelText="取消">
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
                <Space size={12}>
                <Input.Search allowClear onSearch={onSearch} placeholder='请输入学号或姓名'></Input.Search>
                <Button type="primary" icon={<PlusOutlined />} onClick={()=>showDialog()} >新增</Button>
                <Button icon={<DownloadOutlined />} onClick={()=>exportExcel(student,'学生信息表')}>导出数据</Button>
                </Space>
            </div>
            <Table dataSource={student} align="center" columns={columns} rowKey="id" 
             onChange={(page)=>{changePage(page)}}
            pagination={{
                rowKey:'id',
                total:total,
                showQuickJumper: true,
                pageSize:searchParams.size,
                current:searchParams.page,
                showTotal:((total) => {
                    return `共 ${total} 条`;
                  })}}/>;

                <div className="dialog">
                <Modal title={title} visible={visible}  onCancel={()=>setVisible(false)}  onOk={addnewStudent} okText='确认' cancelText='取消'>
                <Form ref={formRef} labelCol= {{span: 4}} wrapperCol= {{ span: 20 }}>
                    <Form.Item
                    label="学号"
                    name="number"
                    validateTrigger="onBlur"
                    rules={[{ required: true, message: '请输入学号' },{len:10,message:'学号长度为10位'}]}>
                        {title==='新増学生'?<Input/>:<span>{currentStudent.number}</span>}
                    </Form.Item>
 
                    <Form.Item
                    label="姓名"
                    name="name"
                    validateTrigger="onBlur"
                    rules={[{ required: true, message: '请输入姓名姓名'},{max:5,message:'姓名最长5个字符'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                    label="性别"
                    name="sex"
                    rules={[{ required: true, message: '请选则性别' }]}>
                       <Select
                            placeholder="性别"
                        >
                            <Option value={0} key="0">女</Option> 
                            <Option value={1} key="1">男</Option> 
                        </Select>
                    </Form.Item>
                    <Form.Item
                    label="班级"
                    >
                        <Form.Item
                        name="classes"
                        rules={[{required: true, message:'请选择班级'}]}
                        >
                            <Cascader   options={classes}  placeholder="请选择班级" />
                        </Form.Item>
                    </Form.Item>
                    <Form.Item
                    label='电话'
                    name='phone'
                    rules={[{required:true,message:'请输入电话'},{len:11,message:'电话长度为11位'}]}
                    >
                        <Input addonBefore={prefixSelector} style={{ width: '100%' }}></Input>
                    </Form.Item>
                        <Form.Item
                        label="寝室"
                        name="room"
                        rules={[{required: true, message:'请选择寝室'}]}
                        >
                            <Cascader   options={roomList}  placeholder="请选择班级" />
                        </Form.Item>
                    <Form.Item
                     label='状态'
                     name='state'
                     rules={[{required:true,message:'请选择状态'}]}
                    >
                        <Select
                        placeholder='状态'
                        >
                            <Option value={0} selected>在校</Option>
                            <Option value={1}>离校</Option>
                        </Select>
                    </Form.Item>
                </Form>
                </Modal>
            </div>
        </div>
    );
}

export default Index;
