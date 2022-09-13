import axios from 'axios';
import { BASE_URL, TIMEOUT } from "./config";
import { message} from 'antd';
export  default function request(config){
    const instance=axios.create({
        baseURL: BASE_URL,
        timeout: TIMEOUT
    })
    instance.interceptors.request.use(config => {
        config.headers.authorization=localStorage.getItem('token')||''
        return config
    },err => {
        console.log(err)
    })
    instance.interceptors.response.use(res => {
        if(res.status!==200){
             return message.warning(res.data.message, 0.9)
        }
        return res
    }, err => {
        return message.error(err.response.data,0.9)
    })
    return instance(config)
}