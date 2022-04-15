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
			rawData: getData[index]
		}

	})



	console.log("转换后的数据:", newData)
	return newData;
}

function statusItemShow(status) {
	switch (status) {
		case 'DaiFenPei'://("待分配", "待受理")
			return {
				color: 'info',//标签颜色
				effect:'light',//标签样式
				opBtnList: {
					orderEditBtn: true, //委托单编辑 按钮
				},
				statusCn:"待受理"
			}
			break;
		case 'DaiShouLi'://("待受理", "待受理")
			return {
				color: 'info',
				effect: 'light',
				opBtnList: {
					orderEditBtn: true, //委托单编辑 按钮
				},
				statusCn:"待受理"
			}
			break;
		case 'DaiShenHe'://("待审核", "待受理")
			return {
				color: 'success',
				effect: 'light',
				opBtnList: {
					entrustFileBtn: true, //委托文件 按钮
				},
				statusCn:"待受理"
			}
			break;
		case 'DaiWanGong'://("待完工", "检测中")
			return {
				color: 'warning',
				effect: 'light',
				opBtnList: {
					acceptanceListBtn: true, //上传验收单 按钮
					entrustFileBtn: true, //委托文件 按钮
				},
				statusCn:"检测中"
			}
			break;
		case 'DaiFuKuan'://("待付款", "待付款")
			return {
				color: '',
				effect: 'plain',
				opBtnList: {
					entrustFileBtn: true, //委托文件 按钮
					acceptanceListBtn: true, //完工验收单 按钮
					paymentProveBtn:true //支付证明
				},
				statusCn:"待付款"
			}
			break;
		case 'DaiHeDui'://("待核对", "已付款")
			return {
				color: '',
				effect: 'dark',
				opBtnList: {
					entrustFileBtn: true, //委托文件 按钮
					paymentProveBtn: true,//支付证明
				},
				statusCn:"已付款"
			}
			break;
		case 'YiWanCheng'://("可取证", "可取证")
			return {
				color: '',
				effect: 'light',
				opBtnList: {
					entrustFileBtn: true, //委托文件 按钮
					paymentProveBtn: true,//支付证明
					downCertBtn: true, //下载证书 按钮
				},
				statusCn:"可取证"
			}
			break;
		case 'ShouLiShiBai'://("已退回", "受理失败")
			return {
				color: 'danger',
				effect: 'light',
				opBtnList: {
					orderEditBtn: true, //委托单编辑 按钮
					resubmitBtn: true //重新提交按钮
				},
				statusCn:"受理失败"
			}
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