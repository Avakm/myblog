import React, { useState, useEffect } from 'react'
import { withRouter } from "react-router-dom";
import { getNoticeById } from '../../services/article'
import './index.less'

function Detail(props) {


  const [ notice, setNotice ] = useState({title:'',content:''})
  
  const {id} = props.match.params

  useEffect(()=>{
    getContent(id*1)
  },[id])

  const getContent = async (id)=>{
    console.log(id)
    const res = await getNoticeById(id)
    console.log(res)
    if(res.status){
      setNotice(res.data)
    }
  }

  return (
    <div className='noticeContent'> 
      <h2 className='noticeTitle'>{notice.title}</h2>
      <div dangerouslySetInnerHTML = {{ __html:notice.content }} /> 
    </div>
  )
}

export default withRouter(Detail)
