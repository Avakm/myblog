import React, { Component, useEffect, useState } from 'react';
import { Table, Image, Button, Space, Popconfirm, message  } from 'antd';
import { SearchOutlined, DeleteOutlined, EditOutlined,ReadOutlined } from '@ant-design/icons';
import { withRouter } from "react-router-dom";
import { getNoticeList, deleteNotice } from '../../services/article'


import './index.less'
import dayjs from 'dayjs';

const  News = (props)=> {
	const [loading,setLoading] = useState()
	const [dataSource,setDataSource] = useState()
	const columns = [
		{
			title:'封面',
			dataIndex:'imageUrl',
			width:300,
			render:(text,record)=>{
				return <Image src={text} placeholder={true} width={200} height={100} style={{objectFit:'cover'}}/>
			}
		},
		{
			title:'标题',
			dataIndex:'title',
			render:(text,record)=>{
				return <div className="list-title">
				<span onClick={()=>props.history.push(`/article/detail/${record.id}`)}   style={{ color: '#1890ff', cursor: 'pointer' }}>{text}</span>
			</div>
			}
		},
		{
			title:'时间',
			dataIndex:'create_time',
			width:200,
			render:(text,record)=>{
				return <div>{ dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</div>
			}
		},
		{
			title:'操作',
			dataIndex:'id',
			fixed:'right',
			width:200,
			render:(text,record)=>(
				<Space size={10}>
					<Button icon={<ReadOutlined />} onClick={()=>props.history.push(`/article/detail/${record.id}`)} shape='circle' type='primary'></Button>
				 <Popconfirm title="确认删除改公告？" okText="确认" onConfirm={()=>delNotice(text)} cancelText="取消">
				<Button icon={<DeleteOutlined />} shape='circle' type='danger'></Button>
			</Popconfirm>
			</Space>
			)
		}
	]

	
	useEffect(()=>{
		getDataSource()
	},[])
    
    const getDataSource = async  ()=>{
		setLoading(true)
        const res = await getNoticeList()
        if(res.status===200){
            console.log(res.data)
			setLoading(false)
			setDataSource(res.data)
        }
    }



	const delNotice = async (id)=>{
		const res = await  deleteNotice({id})
		if(res.status===200){
			message.success('删除成功')
			getDataSource()
		}
	}


		return (
			<div className="shadow-radius">
						<Table
						columns={columns}
						dataSource={dataSource}
						rowKey="id"
						/>
			</div>
		);
}
export default withRouter(News)