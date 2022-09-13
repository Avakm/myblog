import React, { memo } from 'react'
import { Form, Input,Button,message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '../../services/login'
import { setUserInfo } from '../../store/actions/userInfo'
import './index.less'
import { useDispatch } from 'react-redux';

export default memo(function Login(props) {
     
    const dispatch=useDispatch()
    const onFinish=async (values)=>{
        if(!values.username||!values.password){
            return message.warning('请输入用户名和密码',0.9)
        }
        const res = await login(values)
        if(res.status===200){
            message.success('登陆成功',0.8)
            localStorage.setItem('token',res.data.token)
            dispatch(setUserInfo(res.data))
            localStorage.setItem('userInfo',JSON.stringify(res.data))
            props.history.push('/home')
        }
    }
    return (
        <div className='login_style'>
            <div className='contents'>
                <div className='left'>
                    <div className='title'>博客管理系统</div>
                </div>
                <div className='right'>
                    <div className='login_infos'>
                        <div className='welcome'>
                            欢迎登陆
                        </div>
                        <div className='names'>
                            博客管理系统
                        </div>
                        <Form name="normal_login" onFinish={onFinish}  className='myform'>
                            <Form.Item name="username">
                                <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
                            </Form.Item>
                            <Form.Item name="password">
                                <Input prefix={<LockOutlined />} type="password" placeholder="请输入密码"/>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className='footbutton'>
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                        
                    </div>
                </div>
            </div>
            
        </div>
    )
})
