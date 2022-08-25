import {
	timestamp
} from "./index"

//转换业务委托的数据格式
export function cgBsEntrustData(data) {
	data = JSON.parse(JSON.stringify(data))
	console.log("未转换的数据:", data)
	let getData = data.content;
	let newData = [];

	getData.forEach((item, index) => {

		newData[index] = {
			created: timestamp(item.created),
			contact: item.contact,
			mobile: item.mobile,
			remark: item.remark,
			statusCn: statusItemShow(item.status).statusCn,
			receiver: {...item.receiver}.name,
			statusBtnColor: statusItemShow(item.status).color,//标签颜色
			statusBtnStyle:statusItemShow(item.status).effect,//标签样式
			opBtnList: statusItemShow(item.status).opBtnList,
			rawData: getData[index],
			id:item.id
		}

	})

	console.log("转换后的数据:", newData)
	return newData;
}

//状态按钮的 样式，显示哪些需要的功能按钮控制
function statusItemShow(status) {
	let res=new entrust_statusBtnStyle();
	
	switch (status) {
		case 'DaiFenPei'://("待分配", "待受理")
		
			//标签颜色,标签样式，状态的中文显示，需要显示的操作按钮集合
			res.defaultValue('info','light',"待受理",{
				orderEditBtn: true, //委托单编辑 按钮
			});
			
			return res;
			break;
		case 'DaiShouLi'://("待受理", "待受理")
		
			res.defaultValue('info','light',"待受理",{
				orderEditBtn: true, //委托单编辑 按钮
			});
			return res;
			break;
		case 'DaiShenHe'://("待审核", "待受理")
		
			res.defaultValue('success','light',"待受理",{
				entrustFileBtn: true, //委托文件 按钮
			});
			return res;
			break;
		case 'DaiWanGong'://("待完工", "检测中")
		
			res.defaultValue('warning','light',"检测中",{
				acceptanceListBtn: true, //上传验收单 按钮
				entrustFileBtn: true, //委托文件 按钮
			});
			return res;
			break;
		case 'DaiFuKuan'://("待付款", "待付款")
		
			res.defaultValue('','plain',"待付款",{
				entrustFileBtn: true, //委托文件 按钮
				acceptanceListBtn: true, //完工验收单 按钮
				paymentProveBtn:true //支付证明
			});
			return res;
			break;
		case 'DaiHeDui'://("待核对", "已付款")
			
			res.defaultValue('','dark',"已付款",{
				entrustFileBtn: true, //委托文件 按钮
				paymentProveBtn: true,//支付证明
			});
			return res;
			break;
		case 'YiWanCheng'://("可取证", "可取证")
		
			res.defaultValue('','light',"可取证",{
				entrustFileBtn: true, //委托文件 按钮
				paymentProveBtn: true,//支付证明
				downCertBtn: true, //下载证书 按钮
			});
			return res;
			break;
		case 'ShouLiShiBai'://("已退回", "受理失败")
		
			res.defaultValue('danger','light',"受理失败",{
				orderEditBtn: true, //委托单编辑 按钮
				resubmitBtn: true //重新提交按钮
			});
			return res;
			break;
	}
}

//构造函数，提交委托单需要的信息
// ?. 链判断运算符 可以参考 https://es6.ruanyifeng.com/#docs/operator#%E9%93%BE%E5%88%A4%E6%96%AD%E8%BF%90%E7%AE%97%E7%AC%A6
export class entrustObj{
	constructor(data){
		this.contact=data.contact;
		this.mobile=data.mobile;
		this.remark=data.remark;
		this.wordFile=data?.rawData?.orderFile || '';//如果找不到，则默认值为''
		this.orderFile=data?.rawData?.orderFilePdf || '';
	}
}

/** 创建一个 状态按钮 的样式控制 构造函数,
* @param {String} color [elementUI的自带颜色 '':蓝色，'success':绿色，'info':灰色，'warning':黄色，'danger':红色]
* @param {String} style [Tag 组件提供了三个不同的主题：dark、light 和 plain，可以去查文档看样式]
* @param {String} resStatus [转义后台拼音状态，转成你想要表达的中文]
* @param {Object} opBtnList [控制 操作按钮的显示]
*/
export class entrust_statusBtnStyle{
	defaultValue(color,style,resStatus,opBtnList){
		this.color=color;
		this.effect=style;
		this.statusCn=resStatus;
		this.opBtnList=opBtnList;
	}
}