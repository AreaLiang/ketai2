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
}

//业务委托 状态tag标签的样式设置，color => 颜色, effect => 风格
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
export class EntrustObj{
	constructor(data){
		this.contact=data.contact;
		this.mobile=data.mobile;
		this.remark=data.remark;
		this.customerId=data.id;
	}
}

