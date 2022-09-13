import request from './request'

export const uploadImage = (FormData)=>request({
    url:'upload/image',
    headers: { "Content-Type": "multipart/form-data" },
    data:FormData,
    method:'post'
})


export const uploadContentImage = (FormData)=>request({
    url:'upload/image',
    headers: { "Content-Type": "multipart/form-data" },
    data:FormData,
    method:'post'
})