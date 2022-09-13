import {getRoomList} from '../../services/room'

export const selectList = [
    {
        label:'北山书院',
        value:'北山书院'
    },{
        label:'别都书院',
        value:'别都书院'
    },{
        label:'双栀书院',
        value:'双栀书院'
    },{
        label:'荷悦|梅若|松格书院群',
        value:'荷悦|梅若|松格书院群'
    },{
        label:'天渠书院',
        value:'天渠书院'
    },{
        label:'爱莲书院',
        value:'爱莲书院'
    },{
        label:'汇江书院',
        value:'汇江书院'
    },
    {
        label:'花果书院',
        value:'花果书院'
    },{
        label:'鱼城书院',
        value:'鱼城书院'
    },{
        label:'廊桥书院',
        value:'廊桥书院'
    },{
        label:'蓝湖书院',
        value:'蓝湖书院'
    }
]

export const renderRoomList = async () =>{
    const res = await getRoomList()
    const allRoom = res.data.list.filter(item=>item.state===0)
    const newRoomList =selectList.map((room)=>{
        const childrenList = allRoom.filter(item=>item.academy_name===room.value)
        const children = childrenList.map((item)=>{return {label:item.name,value:item.name} })
        return {...room,children}
    })
    return newRoomList
}

export default renderRoomList