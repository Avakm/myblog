import React,{ useRef, forwardRef, useEffect, useImperativeHandle } from 'react'
import { Form, Input, Divider } from 'antd'
import { verifyStudent } from '../../../services/student'

function Step3(props,ref) {

  const { activityInfo } = props
  let studentName;
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
 
  return (
    <Form
    style={{marginTop:'60px'}}
    name="basic"
    labelCol={{ flex: '110px' }}
    labelAlign="left"
    labelWrap
    wrapperCol={{ flex: 1 }}
    colon={false}
    ref={formRef}
  >
    <Form.Item 
    label="申请人学号" 
    rules={[
      { required: true, message:'请输入学号' },
      {len:10,message:'学号长度为10位'},
      {whitespace:true,message:'不能包含空字符'},
      {validator: (rule, value, callback) => { 
        checkNumber(value).then(res => {
          console.log(res)
          if (res.length===0) {
               callback('学号不存在')
          } else {
               studentName=res[0].name
               callback()
          }
        })
        }
      }
    ]}
    name="number"
    >
      <Input  placeholder='请输入申请人学号' />
    </Form.Item>
    <Divider />
    <Form.Item 
    label="申请人姓名" 
    rules={[
      { required: true,  message:'请输入姓名' },
      {max:5,message:'姓名最长5个字符'},
      {type:'string', whitespace:false,message:'不能包含空字符'},
      {validator: (rule, value, callback) => { 
          value!==studentName&&callback('学号与姓名不匹配')
        }
      }
    ]}
    name="name"
    >
        <Input placeholder='请输入申请人姓名'/>
    </Form.Item>
    <Divider />
  </Form>
  )
}

export default forwardRef(Step3)