import {registerApi} from "@/request/api"
import {Message} from "element-ui"
import  * as ckFun from '@/utils/checkInfo'

/* 用户注册输入信息验证,
 *** 传入需要注册的所有信息，作为一个对象传入
 *** objInfo => 用户输入的数据对象
 */
export function checkRegister(objInfo) {
	let {
		account,
		password,
		passwordAgain,
		connectName,
		connectPhone,
		checkList,
		phoneCode,
		captcha,
		area,
	} = objInfo;

	let checkInfoList=[];//验证结果返回的集合，把需要验证的结果添加进去即可
	
	checkInfoList.push(ckFun.ckUserId(account));
	checkInfoList.push(ckFun.ckPassword(password));
	checkInfoList.push(ckFun.ckAgainPd(password, passwordAgain));
	checkInfoList.push(ckFun.ckUserName(connectName));
	checkInfoList.push(ckFun.ckPhone(connectPhone));
	checkInfoList.push(ckFun.ckServeRange(checkList));
	checkInfoList.push(ckFun.ckNull(area,'请勾选所辖区域'));
	checkInfoList.push(ckFun.ckNull(captcha,'请输入验证码'));
	checkInfoList.push(ckFun.ckNull(phoneCode,'请获取手机验证码'));

	for(let i=0;i<checkInfoList.length;i++){
		if(checkInfoList[i].status){//如果验证全部都通过则进行下一步
			if(i==checkInfoList.length-1){//判断是否已经遍历完成
				return true;
			}
		}else{
			Message.error(checkInfoList[i].mes);
			return false;
		}
	}
}

