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
	ckPhoneCode
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
		phoneCode
	} = objInfo;

	let isUserId = ckUserId(account);
	let isPassword = ckPassword(password);
	let isAgainPd = ckAgainPd(password, passwordAgain);
	let isUserName = ckUserName(connectName);
	let isPhone = ckPhone(connectPhone);
	let isServeRange = ckServeRange(checkList);
	let isPhoneCode = ckPhoneCode(phoneCode)

	if (isUserId.status) {
		if (isPassword.status) {
			if (isAgainPd.status) {
				if (isUserName.status) {
					if (isPhone.status) {
						if (isServeRange.status) {
							if (isPhoneCode) {
								if (agreesCheck) {
									//检验成功
									return true
								} else {
									obj.$message.error("请勾选同意协议")
								}
							} else {
								obj.$message.error(isServeRange.mes)
							}

						} else {
							obj.$message.error(isServeRange.mes)
						}
					} else {
						obj.$message.error(isPhone.mes)
					}
				} else {
					obj.$message.error(isUserName.mes)
				}
			} else {
				obj.$message.error(isAgainPd.mes)
			}
		} else {
			obj.$message.error(isPassword.mes)
		}
	} else {
		obj.$message.error(isUserId.mes)
	}

}

//创建一个异步获取手机验证码的方法
function getPhoneCode(phone, code) {
	return new Promise((resolve, reject) => {
		phoneCodeApi({
			phone: phone,
			code: code
		}).then((response) => {
			resolve(response)
		}).catch((error) => reject(error))
	});
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
	getPhoneCode,
	registerfun
}
