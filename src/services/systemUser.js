import request from "./request";
export const list = (data)=>request({
    url:'users/list',
    params:data
})

export const deleteUser = (data)=> request({
    url:'users',
    data:{
        username:data
    },
    method:'delete'
})

export const addSysUser = (data)=> request({
    url:'users',
    data,
    method:'post'
})

export const detail = (username) =>request({
    url:'users/edit',
    params:{username}
})

export const editUser = (data)=> request({
    url:'users',
    data,
    method:'put'
})

export const editPassword = (data)=> request({
    url:'users/password',
    data,
    method:'post'
})
