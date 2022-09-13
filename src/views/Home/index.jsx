import React from 'react'
import { Image } from 'antd'
import bgImg from '../../assets/img/bg.jpg'
import './index.less'

export default function index() {
    return (
    <div className="shadow-radius">
        <Image src={bgImg}></Image>
    </div>
    )
}
