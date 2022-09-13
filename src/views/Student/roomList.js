const children2 = []
for(let i=1;i<21;i++){
    if(i<10){
        children2.push({label:`0${i}`,value:`0${i}`})
    }else{
        children2.push({label:`${i}`,value:`${i}`})
    }
}
const children1 = []
for(let i=1;i<6;i++){
    children1.push({label:`${i}`,value:`${i}`,children:children2})
}
const aroomList = []
for(let i=1;i<14;i++){
    aroomList.push({label:`A${i}`,value:`A${i}`,children:children1})
}

const roomList = [
    ...aroomList,
    {
        label:'B1',
        value:'B1',
        children:children1
    },
    {
        label:'B2',
        value:'B2',
        children:children1
    },
    {
        label:'C1',
        value:'C1',
        children:children1
    },
    {
        label:'C2',
        value:'C2',
        children:children1
    },
    {
        label:'C3',
        value:'C3',
        children:children1
    },
    {
        label:'C4',
        value:'C4',
        children:children1
    },
    {
        label:'D1',
        value:'D1',
        children:children1
    },
    {
        label:'D2',
        value:'D2',
        children:children1
    },
    
]
export default roomList