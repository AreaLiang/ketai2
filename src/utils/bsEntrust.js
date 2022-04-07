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
			statusCn: item.statusCn,
			receiver: {
				...item.receiver
			}.name,
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
		case 'DaiFenPei':
			return {
				color: 'info',//标签颜色
				effect:'light',//标签样式
				opBtnList: {
					orderEditBtn: true, //委托单编辑 按钮
				}
			}
			break;
		case 'DaiShouLi':
			return {
				color: 'info',
				effect: 'light',
				opBtnList: {
					orderEditBtn: true, //委托单编辑 按钮
				}
			}
			break;
		case 'DaiShenHe':
			return {
				color: 'success',
				effect: 'light',
				opBtnList: {
					entrustFileBtn: true, //委托文件 按钮
				}
			}
			break;
		case 'DaiWanGong':
			return {
				color: 'warning',
				effect: 'light',
				opBtnList: {
					acceptanceListBtn: true, //委托单编辑 按钮
					entrustFileBtn: true, //委托文件 按钮
				}
			}
			break;
		case 'DaiFuKuan':
			return {
				color: '',
				effect: 'plain',
				opBtnList: {
					orderEditBtn: false, //委托单编辑 按钮
					entrustFileBtn: true, //委托文件 按钮
					paymentShowBtn: false, //支付证明 按钮
					downCertBtn: true, //下载证书 按钮
				}
			}
			break;
		case 'DaiHeDui':
			return {
				color: 'warning',
				effect: 'light',
				opBtnList: {
					orderEditBtn: false, //委托单编辑 按钮
					entrustFileBtn: true, //委托文件 按钮
					paymentShowBtn: false, //支付证明 按钮
					downCertBtn: true, //下载证书 按钮
				}
			}
			break;
		case 'YiWanCheng':
			return {
				color: '',
				effect: 'light',
				opBtnList: {
					entrustFileBtn: true, //委托文件 按钮
					paymentProveBtn: true,//支付证明
					downCertBtn: true, //下载证书 按钮
				}
			}
			break;
		case 'ShouLiShiBai':
			return {
				color: 'danger',
				effect: 'light',
				opBtnList: {
					orderEditBtn: true, //委托单编辑 按钮
					resubmitBtn: true //重新提交按钮
				}
			}
			break;
	}
}
