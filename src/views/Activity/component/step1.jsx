import React, { useEffect, useState} from 'react'
import { Row, Col, DatePicker, Button, Space, Select, Table, Tag,Popconfirm  } from 'antd';
import { selectList } from '../roomList'
import moment from 'moment'
import { getRoomList as getRoomListService  }  from '../../../services/room'
import { getTimeTable } from '../../../services/apply'

const { Option } = Select
export default function Step(props) {

    const { next, saveInfo } = props
    const [ currentSelect, setCurrentSelect ] = useState('')
    const [ currentRoomList, setCurrentRoomList ] = useState([])
    const [ currentDate, setCurrentDate ] = useState(moment())
    const [ currentRoom, setCurrentRoom ] = useState({})
    const [ selectTime, setSelectTime ] = useState([])
    const [ timeList, setTimeList ] = useState([])

    useEffect(()=>{
        getRoomList()
    },[])

    const getRoomList = async ()=>{
        const res = await getRoomListService ()
        console.log(res.data)
        if(res.status===200){
            currentSelect?
            setCurrentRoomList(res.data.list.filter(item=>item.academy_name===currentSelect)):
            setCurrentRoomList(res.data.list)
        }
    }


    const loadingTimeTable = async (room)=>{
        console.log(moment(currentDate).format('YYYY-MM-DD'))
        const res = await getTimeTable({academy_id:room.id,date:moment(currentDate).format('YYYY-MM-DD')})
        if(res.status===200){
            console.log(res.data)
            setTimeList(res.data)
            setCurrentRoom(room)
        }
    }

    const appoint = (time=selectTime)=>{
        console.log(time)
        const timeList = Array.isArray(time)?time:[time]
        saveInfo({
            date:moment(currentDate).format('YYYY-MM-DD'),
            time:timeList,
            tag:Math.round(Math.random()*10000),
            academy_id:currentRoom.id,
            activity_address:`${currentRoom.academy_name}-${currentRoom.name}`,
            maxCount:currentRoom.count
        })
        next()
    }
    const columns1 = [
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '描述',
          dataIndex: 'message',
          key: 'message',
        },
        {
          title: '容纳人数',
          dataIndex: 'count',
          key: 'count',
        },
        {
            title:'操作',
            render:(text,record)=>{
                return <Button type='link' onClick={()=>loadingTimeTable(record)}>选择</Button>
            }
        }
    ];

    const columns2 = [
        {
            title:'时间',
            dataIndex:'time'
        },
        {
            title:'状态',
            dataIndex:'state',
            render:(text,record)=>{
                return text===0?<Tag color="#87d068">空闲</Tag >:<Tag color="#f50">已预约</Tag> 
            }
        },
        {
            title:'操作',
            render:(text,record)=>{
                return  record.state===0?
                <Popconfirm title="确认预约该时间吗？" okText="确认" onConfirm={()=>appoint(record.time)} cancelText="取消">
                    <Button type='link'>预约</Button>
                </Popconfirm>:
                <Button type="link" disabled>预约</Button>
            }
        }
    ]

    return (
        <Row gutter={16} style={{width:'100%'}}>
        <Col className="gutter-row" span={12}>
            <Space size={6}>
            <Select 
            style={{ width: 200 }}
            onChange={(value)=>setCurrentSelect(value)}
            placeholder="请选择书院"
            >
                { selectList.map((item,index)=>{
                    return <Option key={index} value={item.value}>{item.label}</Option>
                })}
            </Select>
            <Button type='primary' onClick={getRoomList}>确定</Button>
            </Space>
            <Table 
            rowKey="id"
            dataSource={currentRoomList}
            pagination={false}
            columns={columns1} 
            scroll={{y:500}}
            />
        </Col>
        {/* <Divider type="vertical"/> */}
        <Col className="gutter-row" span={12}>
            <div style={{ display:'flex',justifyContent:'space-between'}}>
            <Space size={12}>
                <DatePicker  
                defaultValue={currentDate}
                placeholder='请选择时间'
                onChange={(value)=>setCurrentDate(value)}
                />
                <Button  type='primary' onClick={()=>loadingTimeTable(currentRoom)}>选择</Button>
            </Space>
            <Button type='primary' onClick={()=>appoint()}>预约选中时间</Button>
            </div>
            <Table  
            dataSource={timeList} 
            pagination={false} 
            columns={columns2}
            scroll={{y:500}}
            rowSelection={{
                ...selectList,
                getCheckboxProps:(record)=>({
                    disabled:record.state === 1
                }),
                onChange: (selectedRowKeys, selectedRows) => {
                    setSelectTime([...new Set(selectedRowKeys)])
                }
            }}
            rowKey="time"
            >
            </Table>
        </Col>
        </Row>
    )
}
