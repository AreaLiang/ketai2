import {
	timestamp
} from "./index"

//转换业务委托的数据格式
export function cgBsEntrustData(data) {
	
	let getData = data.content;
	
	return getData.map((p)=>{
		p.created=timestamp(p.created);
		return p ;
	})
	
	// getData.forEach((item, index) => {
	// 	console.log(typeof(statusItemShow(item.status)))
	// 	newData[index] = {
	// 		created: timestamp(item.created),
	// 		contact: item.contact,
	// 		mobile: item.mobile,
	// 		remark: item.remark,
	// 		statusCn: statusItemShow(item.status).statusCn,
	// 		receiver: {...item.receiver}.name,
	// 		statusBtnColor: statusItemShow(item.status).color,//标签颜色
	// 		statusBtnStyle:statusItemShow(item.status).effect,//标签样式
	// 		opBtnList: statusItemShow(item.status).opBtnList,
	// 		rawData: getData[index],
	// 		id:item.id
	// 	}
	// })
	
}

export function statusStyleControl(){
	const map =new Map([
		['DaiFenPei',
		{
			color:'info',
			effect:'light',
		}],
		
		['DaiShouLi',
		{
			color:'info',
			effect:'light'
		}],
		
		['DaiShenHe',
		{
			color:'success',
			effect:'light'
		}],
		
		['DaiWanGong',
		{
			color:'warning',
			effect:'light'
		}],
		
		['DaiFuKuan',
		{
			color:'',
			effect:'plain'
		}],
		
		['DaiHeDui',
		{
			color:'',
			effect:'dark'
		}],
		
		['YiWanCheng',
		{
			color:'',
			effect:'light'
		}],
		
		['ShouLiShiBai',
		{
			color:'danger',
			effect:'light'
		}],
		
		['DaiShiGong',
		{
			color:'success',
			effect:'dark'
		}]
		
	])
	
	return map;
}


//构造函数，提交委托单需要的信息
// ?. 链判断运算符 可以参考 https://es6.ruanyifeng.com/#docs/operator#%E9%93%BE%E5%88%A4%E6%96%AD%E8%BF%90%E7%AE%97%E7%AC%A6
export class EntrustObj{
	constructor(data){
		this.contact=data.contact;
		this.mobile=data.mobile;
		this.remark=data.remark;
		this.customerId=data.id;
	}
}

