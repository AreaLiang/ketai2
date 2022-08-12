import axios from 'axios'; // 引入axios
import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据
import store from '@/store';
import router from "@/router"
import {Message} from "element-ui"

axios.defaults.timeout = 15000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
// 环境的切换
// if (process.env.NODE_ENV == 'development') {    
//     axios.defaults.baseURL = '/api';
// } else if (process.env.NODE_ENV == 'debug') {    
//     axios.defaults.baseURL = '';
// } else if (process.env.NODE_ENV == 'production') {    
//     axios.defaults.baseURL = 'http://api.123dailu.com/';
// }

// axios.defaults.baseURL = 'http://192.168.0.103:9092';

// 请求拦截器
axios.interceptors.request.use(

	config => {
		// 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
		// 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断

		const token = sessionStorage.getItem('token');

		if (token) {
			// token && (config.headers.Authorization = `Bearer ${token}`);
			token && (config.headers.Authorization = token);
		} else {
			router.push('/Login');
		}
		return config;
	},
	error => {
		return Promise.error(error);
	}
)

axios.interceptors.response.use( 
	response=> {
		if(response.data.code==20002){//判断token是否过期
			Message.warning("token失效，请重新登录");
			sessionStorage.removeItem('token');
			setTimeout(()=>{
				router.push('/Login');
			},1000)
		}else return response
	}, function(error) {
		return Promise.reject(error)
	}
)



/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
	return new Promise((resolve, reject) => {
		axios.get(url, {
			params: params
		}).then(res => {
			resolve(res.data);
		}).catch(err => {
			reject(err.data)
		})
	});
}


/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params) {
	return new Promise((resolve, reject) => {
		axios.post(url, QS.stringify(params))
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err.data)
			})
	});
}

/** 
 * post formData方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function formDatapost(url, params) {
	return new Promise((resolve, reject) => {
		axios.post(url, params)
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err.data)
			})
	});
}
