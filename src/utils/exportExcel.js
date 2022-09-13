import ExportJsonExcel from 'js-export-excel';

function exportExcel(datas,filename){
    const options = {}
    switch (filename) {
        case '学生信息表':
            const res = datas.map(item=>{
                return item.sex===1?{...item,sex:'男'}:{...item,sex:'女'}
            })
            const studentList = res.map(item=>{
                return item.state===1?{...item,state:'离校'}:{...item,state:'在校'}
            })
            options.filename = filename
            options.datas=[
                {
                    sheetData:studentList,
                    sheetName:'sheet',
                    sheetFilter:['number','name','sex','class','phone','room','state'],
                    sheetHeader:['学号','姓名','性别','班级','电话','寝室','状态']
                }
            ]
            break;
        case '参与者信息表':
            const {activity_name,memberList} = datas
            options.filename = filename
            options.datas=[
                {
                    sheetData:memberList,
                    sheetName:'sheet',
                    sheetFilter:['member_number','member_name'],
                    sheetHeader:['学号','姓名']
                }
            ]
            break;
        case '活动室信息表':
            options.filename = filename
            const roomList = datas.map(item=>{
                return item.state===1?{...item,state:'停用'}:{...item,state:'正常'}
            })
            options.datas=[
                {
                    sheetData:roomList,
                    sheetName:'sheet',
                    sheetFilter:['image','name','message','count','academy_name','state'],
                    sheetHeader:['图片','名称','简介','容纳人数','所属书院','状态']
                }
            ]
            break;
        default:
            break;
    }

    var toExcel = new ExportJsonExcel(options); //new
    toExcel.saveExcel();
}


export default exportExcel