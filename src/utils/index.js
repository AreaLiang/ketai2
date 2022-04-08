import router from '@/router'
import { Message } from 'element-ui';
import {baseUrl} from '@/request/api'
// import store from './store'

//删除浏览器缓存,isGoLoigin是否转跳到登录页面，默认转跳
export function removeSessionStorage(name, isGoLoigin) {
	isGoLoigin = isGoLoigin == true ? true : false;

	sessionStorage.removeItem(name); //清除缓存
	if (isGoLoigin) {
		router.push("/Login");
	}
}

//图片转换成base 64格式方法
export function getBase64(file) {
	return new Promise((resolve, reject) => {
		let rd = new FileReader() // 创建文件读取对象
		rd.readAsDataURL(file) // 文件读取装换为base64类型
		rd.onloadend = function(e) {
			// this指向当前方法onloadend的作用域, this.result就是文件的base64， 这里可自由处理
			resolve(this.result);
		}
	})
}

//时间戳转换
export function timestamp(nS) {
	return new Date(parseInt(nS) * 1).toLocaleString().replace(/:\d{1,2}$/, ' ');
}

//仅使用于element UI 的照片格式验证
export function isImgFormat(file){
	const isJEPG = file.type === 'image/jpeg';
	const isJPG = file.type === 'image/jpg';
	const isPNG = file.type === 'image/png';
				
	if (isJEPG || isJPG || isPNG) {
		return true
	} else {
		Message.error('证件只能是上传图片格式!');
		return false
	}
}

//委托文件、委托单返回的路径,suffix:文件后缀，传入字符串
export function fileShowPath(file,suffix){
	let fileUrl=file+suffix;//文件路径
	
	let reg=new RegExp("hall");//匹配服务端的 hall字符串，准备替换
	let newUrl=baseUrl.replace(reg,fileUrl);
	
	return newUrl;
}