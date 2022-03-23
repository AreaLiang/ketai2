const success = {
	"status": true,
	"mes": ''
}

//判断用户名称是否为空
export function ckUserId(value) {
	if (value == '' || value == null) {
		return {
			"status": false,
			"mes": '客户名称不能为空'
		}
	} else {
		return success
	}
}

//判断用户密码是否为空
export function ckPassword(value) {
	if (value == '' || value == null) {
		return {
			"status": false,
			"mes": '登录密码不能为空'
		}
	} else {
		if(value.length>=6){
			return success
		}else{
			return {
				"status": false,
				"mes": '登录密码至少6位'
			}
		}
	}
}

//判断确认密码是否为空
export function ckAgainPd(first, second) {
	if (second == '' || second == null) {
		return {
			"status": false,
			"mes": '确认密码不能为空'
		}
	} else {
		//判断两次密码是否相同
		if (first == second) {
			return success
		} else {
			console.log(first,second)
			return {
				"status": false,
				"mes": '第二次密码和第一次不相同'
			}
		}
	}
}

//检验 联系人姓名 信息
export function ckUserName(value) {
	if (value == '' || value == null) {
		return {
			"status": false,
			"mes": '联系人姓名不能为空'
		}
	} else {
		//判断是否全是中文
		var reg = /^[\u0391-\uFFE5]+$/;
		if (value != "" && !reg.test(value)) {
			return {
				"status": false,
				"mes": '必须输入中文'
			}
		} else {
			return success
		}
	}
}

//检验手机电话输入信息
export function ckPhone(value) {
	if (value == '' || value == null) {
		return {
			"status": false,
			"mes": '联系手机号不能为空'
		}
	} else {
		//判断是否全是数字
		var reg = /^[0-9]+$/;
		if (value != "" && !reg.test(value)) {
			return {
				"status": false,
				"mes": '只能是数字'
			};
		} else {
			if(value.length==11){
				return success
			}{
				return {
					"status": false,
					"mes": '请输入正确的11位手机号码'
				};
			}
		}
	}
}

//判断 业务范围是否勾选
export function ckServeRange(value) {
	if (value.length>0) {
		return success
	} else {
		return {
			"status": false,
			"mes": '至少选一个业务范围'
		};
	}
}
