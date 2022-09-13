import React,{ useState, useEffect, useRef, forwardRef} from 'react';
import { Steps, Button, message, Input, InputNumber, DatePicker,Form,Cascader, Divider,TimePicker} from 'antd';
import dayjs from 'dayjs'
import moment from 'moment';
import Step1 from './component/step1'
import Step2 from './component/step2'
import Step3 from './component/step3';
import { renderRoomList } from './roomList';
import { addApply } from '../../services/apply'
import './index.less'
const { Step } = Steps;

  const Add = () => {
    const [current, setCurrent] = useState(0);
    const [activityInfo,setactivityInfo] = useState({activity_address:'',date:'',time:'', activity_name:'',activity_message:'',activity_count:0,number:'',name:''})
    const formRef1 = useRef()
    const formRef2 = useRef()

    const addActivity = async ()=>{
      const {time} = activityInfo
      const res = Promise.all(time.map(async (item)=>{
        const res = await addApply({...activityInfo,time:item})
        return res
      }))
      console.log(res)
      res.then(res=>{
        message.success('申请成功')
        setCurrent(0)
        setactivityInfo({})
      })
    }
  
    const next =  () => {
      if(current===1 || current===2) {
        const formRef = current ===1?formRef1:formRef2
        const res = formRef?.current.getvalue()
        setCurrent(current=>current + 1);
        saveInfo(res)
        return
      }
      setCurrent(current + 1);
    };
  
    const prev = () => {
      setCurrent(current - 1);
    };
    
    const saveInfo = async (info)=>{
      const res = await info
      console.log(res)
      setactivityInfo({...activityInfo,...res})
    }
    const steps = [
      {
        title: '活动室预约',
        content: <Step1 next={next} saveInfo={saveInfo} activityInfo={activityInfo} />
      },
      {
        title: '活动信息',
        content: <Step2 saveInfo={saveInfo}  ref={formRef1}  activityInfo={activityInfo} />,
      },
      {
        title: '申请人信息',
        content: <Step3 saveInfo={saveInfo} ref={formRef2}  activityInfo={activityInfo} />
      },
      {
        title: '提交',
        content: <div>
          <h1>注意事项:</h1>
          <h2>1.请将确保关键信息填写完整</h2>
          <h2>2.需确保申请通过才能使用活动室</h2>
          <h2>3.使用完房间需无归原处，并清理垃圾</h2>
          <h2>4.点击提交将自动申请活动时间段房间的使用</h2>
        </div>
      },
    ];
  
    
    return (
      <>
        <Steps current={current}  style={{width:'100%',padding:'20px'}}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{steps[current].content}</div>
        <div className="steps-action">
          { (current < steps.length - 1 && current!==0 )  && (
            <Button type="primary" onClick={() => next()}>
              下一步
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={addActivity}>
              提交
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              上一步
            </Button>
          )}
        </div>
      </>
    );
  };

export default Add;
