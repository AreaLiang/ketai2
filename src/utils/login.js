import Qs from 'qs' //增加了一些安全性的查询字符串解析和序列化字符串的库。
import axios from 'axios'
import {loginApi,phoneCodeApi,registerApi} from "@/request/api"

import {
	ckUserId,
	ckPassword,
	ckAgainPd,
	ckUserName,
	ckPhone,
	ckServeRange,
	ckNull
} from '@/utils/checkInfo'

//创建一个异步 登录函数
function loginfun(account, passWord) {
	return new Promise((resolve, reject) => {

		let url = loginApi().url; //获取后台接口的api
		let method = loginApi().method;

		axios({
			method: method,
			url: url,
			data: {
				loginname: account,
				password: passWord
			},
			transformRequest: [function(data, headers) {
				// 对 data 进行任意转换处理
				var res = Qs.stringify(data)
				return res;
			}],
		}).then((response) => {
			resolve(response.data)
		}).catch((error) => reject(error))
	
	})
}

/* 用户注册输入信息验证,
 *** 传入需要注册的所有信息，作为一个对象传入
 *** obj => elementUI 需要用到的this对象,传入this即可 ,objInfo => 用户输入的数据对象
 */
function checkRegister(obj, objInfo) {
	let {
		account,
		password,
		passwordAgain,
		connectName,
		connectPhone,
		agreesCheck,
		checkList,
		phoneCode,
		captcha,
	} = objInfo;

	let checkInfoList=[];//验证结果返回的集合，把需要验证的结果添加进去即可
	
	checkInfoList.push(ckUserId(account));
	checkInfoList.push(ckPassword(password));
	checkInfoList.push(ckAgainPd(password, passwordAgain));
	checkInfoList.push(ckUserName(connectName));
	checkInfoList.push(ckPhone(connectPhone));
	checkInfoList.push(ckServeRange(checkList));
	checkInfoList.push(ckNull(captcha,'请输入验证码'));
	checkInfoList.push(ckNull(phoneCode,'请获取手机验证码'));
	checkInfoList.push(ckNull(agreesCheck,'请勾选同意协议'));
	
	for(let i=0;i<checkInfoList.length;i++){
		if(checkInfoList[i].status){//如果验证全部都通过则进行下一步
			if(i==checkInfoList.length-1){//判断是否已经遍历完成
				return true;
			}
		}else{
			obj.$message.error(checkInfoList[i].mes);
			return false;
		}
	}
}

/* 创建一个异步的 注册函数,
 *** 传入需要注册的所有信息，作为一个对象传入
 *** objInfo => 用户输入的数据对象
 */
function registerfun(objInfo) {
	//获取用户输入信息
	let {
		account,
		password,
		connectName,
		connectPhone,
		phoneCode,
		checkList,
		captcha
	} = objInfo;
	
	checkList=checkList.join(',');//数组转换成字符串
	
	return new Promise((resolve, reject) => {
		registerApi({
			phoneCode: phoneCode,
			phone: connectPhone,
			name:account,
			contact:connectName,
			password:password,
			business:checkList,
			code:captcha
		}).then((response) => {
			resolve(response)
		}).catch((error) => reject(error))
	})
}



export {
	loginfun,
	checkRegister,
	registerfun
}
