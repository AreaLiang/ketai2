const port='http://192.168.0.103:9092';//本地端口
// const port='http:localhost:8080/apo'

// export function getUserInfo(){
// 	const api={
// 	  url: port+'/hall/login',
// 	  method: 'get'
// 	}
// 	return api;
// }

export function loginApi(){
	const api={
	  url: port+'/hall/login',
	  method: 'post',
	}
	return api;
}

export function captchaApi(){
	const api={
	  url: port+'/hall/captcha',
	  method: 'post',
	}
	return api;
}