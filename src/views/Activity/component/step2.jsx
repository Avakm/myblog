import React, { useEffect,useRef, useState,useImperativeHandle,forwardRef  } from 'react'
import { Form, Input, Divider,InputNumber, Button } from 'antd'


const { TextArea } = Input;

function Step2(props,ref) {

    const { activityInfo } = props
    const formRef = useRef()

    useImperativeHandle(ref, () => ({
        getvalue: () => {
          const value =  formRef?.current.validateFields();
          return value
        }
      }));

    useEffect(()=>{
        formRef?.current.setFieldsValue({
            ...activityInfo
        })
    })
  return (
    <Form
        name="basic"
        labelCol={{ flex: '110px' }}
        labelAlign="left"
        labelWrap
        wrapperCol={{ flex: 1 }}
        colon={false}
        ref={formRef}
      >
        <Form.Item 
        label="活动名称"
        name="activity_name"
        rules={[
            { required: true,message:'请输入活动名称' }
        ]}
        >
          <Input    placeholder="请输入活动名称" />
        </Form.Item>
        <Divider />
        <Form.Item 
        label="活动人数" 
        name="activity_count"
        rules={[
          { required: true, message:'请输入活动人数' },
          { type:"number" ,min:1,message:'人数不能为0'},
          { type:"number",max:activityInfo.maxCount,message:'不能超过活动室最大容纳人数'}
        ]}
        >
          <InputNumber  min={1}  placeholder="请输入人数" />
        </Form.Item>
        <Divider />
        <Form.Item 
        label="活动详情" 
        name="activity_message"
        rules={[{ required: true,message:'请输入活动描述'  }]}>
          <TextArea placeholder="请输入活动详情"   showCount maxLength={100} style={{ height: 120 }}/>
        </Form.Item>
        <Divider />
        <Form.Item>
        </Form.Item>
    </Form>
      
  )
}

export default forwardRef(Step2)
