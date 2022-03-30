const port='http://192.168.0.103:9092';//本地端口
// const port='http:localhost:8080/apo'


//登录Api
export function loginApi(){
	const api={
	  url: port+'/hall/login',
	  method: 'post',
	}
	return api;
}

//注册Api
export function registerApi(){
	const api={
	  url: port+'/hall/register',
	  method: 'post',
	}
	return api;
}

//图形验证码Api
export function captchaApi(){
	const api={
	  url: port+'/hall/captcha',
	  method: 'post',
	}
	return api;
}

//注册时候手机验证码Api
export function phoneCodeApi(){
	const api={
	  url: port+'/hall/sendSms',
	  method: 'post',
	}
	return api;
}

//验证用户信息
export function ckUserInfoApi(){
	const api={
	  url: port+'/hall/getCurrentCustomerInfo',
	  method: 'post',
	}
	return api;
}
