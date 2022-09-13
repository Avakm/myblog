import React from 'react'
import { List, Avatar, Button, Skeleton,Tag, message } from 'antd';
import {
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
  } from '@ant-design/icons';
import { getApplyList,updateApply } from '../../services/apply';
import dayjs from 'dayjs';
import './index.less'

class ApplyList extends React.Component {
  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
    page:1
  };
  count=5
  now = dayjs(new Date()).format('YYYY-MM-DD HH:00')
  getList = async ()=>{
    const {page} = this.state
    const res = await getApplyList({page,size:this.count*page})
    console.log(res)
    this.setState({
      list: res.data,
      page:this.state.page+1,
      loading:false,
      initLoading:false
    })
  }

  componentDidMount() {
    this.getList()
  }

  onLoadMore = () => {
    this.setState({
      loading: true,
    },()=>{
        this.getList()
    });
  };

  renderState = (state,start_time)=>{
    if(this.now>dayjs(start_time).format('YYYY-MM-DD HH:00')&&state===0){
        return <Tag icon={<ExclamationCircleOutlined />} color="warning">
                已过期
      </Tag>
    }else if(state===0&&this.now<dayjs(start_time).format('YYYY-MM-DD HH:00')){
           return  <Tag icon={<SyncOutlined spin />} color="processing">
                   申请中
            </Tag>
    }
    else if(state===1){
           return <Tag icon={<CheckCircleOutlined />} color="success">
                通过
            </Tag>
    }
    else if(state===2){
           return  <Tag icon={<CloseCircleOutlined />} color="error">
                未通过
            </Tag>
        }
      
  }

  renderActions = (state,start_time,id)=>{
      if(state===0){
        if(this.now>dayjs(start_time).format('YYYY-MM-DD HH:00')){
          return <Tag icon={<ExclamationCircleOutlined />} color="warning">
                  已过期
        </Tag>
      }else{
         return  [<Button type='primary' onClick={()=>this.onChangeApply(id,1)}>通过</Button>,<Button onClick={()=>this.onChangeApply(id,2)}   type='danger'>不通过</Button>]
        }
      }else if(state===1){
        if(this.now>dayjs(start_time).format('YYYY-MM-DD HH:00')){
          return [<Tag icon={<ExclamationCircleOutlined />} color="warning">
                  已过期
        </Tag>]
        }else{
          return [<Button type='danger' onClick={()=>this.onChangeApply(id,2)}>撤销</Button>]
        }
      }else if(state===2){
          if(this.now>dayjs(start_time).format('YYYY-MM-DD HH:00')){
            return [<Tag icon={<ExclamationCircleOutlined />} color="warning">
                    已过期
          </Tag>]
        }else{
          return  [<Button type='primary' onClick={()=>this.onChangeApply(id,1)}>通过</Button>]
        }
      }
  }

  onChangeApply = async (id,state)=>{
    const size = this.state.list.length
    const res = await updateApply({id,state})
    if(res.status===200){
      const res = await getApplyList({page:1,size})
      this.setState({
        list:res.data
      })
    }
  }
  render() {
    const { initLoading, loading, list } = this.state;
    const loadMore =
      !initLoading && !loading ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
          }}
        >
          <Button onClick={this.onLoadMore}>加载更多</Button>
        </div>
      ) : null;

    return (
      <List
        className="demo-loadmore-list"
        loading={initLoading}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={list}
        renderItem={item =>(
          <List.Item
            actions={this.renderActions(item.state,item.start_time,item.id)}
            key={item.id}
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                title={<span><Tag color="magenta">活动名称:</Tag>{item.activity_name}</span>}
                description={<span><Tag color="magenta">活动详情:</Tag>{item.activity_message}</span>}
              />
                <div className='activity_address'>
                    <div>{<span>活动地点:{item.activity_address}</span>}</div>
                    <div>{<span>活动时间:{(`${dayjs(item.date).format('YYYY-MM-DD')} ${item.time}`)}</span>}</div>
                </div>
                <div className="activity_student">
                  <div>{item.name}</div>
                  <div>{item.number}</div>
                </div>
                <div>{this.renderState(item.state,item.start_time)}</div>
            </Skeleton>
          </List.Item>
        )}
      />
    );
  }
}



export default ApplyList