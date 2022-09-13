import request from "./request";

export const getNoticeList = (data)=>request({
    url:'article',
    params:data,
    method:'get'
})

export const getNoticeById = (id) =>request({
    url:`article/${id}`,
    method:'get'
})

export const updateNotice = (data)=>request({
    url:'article',
    data,
    method:'put'
})

export const addNotice = (data)=>request({
    url:'article',
    data,
    method:'post'
})
export const deleteNotice = (data)=>request({
    url:'article',
    data,
    method:'delete'
})