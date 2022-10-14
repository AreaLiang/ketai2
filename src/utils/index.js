import router,{resetRouter,errorRouter,asyncRouter} from '@/router'
import {Message} from 'element-ui';
import {baseUrl} from '@/request/http'
import store from '@/store'
import JSZip from "jszip";
import {saveAs} from 'file-saver';
import axios from 'axios'

/**
 * 删除浏览器缓存
 * @param {String} name [缓存的名称]
 * @param {boolean} isGoLoigin [是否转跳到登录页面，默认转跳]
 */
export function removeSessionStorage(name, isGoLoigin) {
	isGoLoigin = isGoLoigin == true ? true : false;

	sessionStorage.removeItem(name); //清除缓存
	if (isGoLoigin) { //转跳登陆页面
		router.push("/Login");
	}
}

/**
 * 节流
 * @param {Function} fn [要执行方法]
 * @param {Number} interval [豪秒数，规定在一个单位时间内，只能触发一次函数]
 * @param {Object} options [leading表示首次是否触发,trailing 是否只需要有一个定时器]
 */

export function throttle (fn , interval = 1000,options = {leading: true,trailing: false}) {
	const {leading,trailing} = options
	let lastTime = 0;
	let timer = null;
	// 时间触发时，真正执行的函数
	const _throttle = function() {
		// 获取当前事件触发时的时间
		const nowTime = new Date().getTime();
		// 当最后的时候和当前时间相等的时候(第一次没有触发)
		if (!lastTime && !leading) lastTime = nowTime
		// 使用当前触发的时间和之前的时间间隔以及上一次开始的时间， 计算出还剩余多长事件需要去触发函数
		const remainTime = interval - (nowTime - lastTime)
		if (remainTime <= 0) {
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
			// 真正触发函数
			fn.apply(this,arguments);
			// 保留上次触发的时间
			lastTime = nowTime;
			// 没有加定时器的时候直接return掉
			return;
		}
		// 只需要有一个定时器即可
		if (trailing && !timer) {
			timer = setTimeout(() => {
				timer = null;
				// 仅仅执行一次
				lastTime = !leading ? 0 : new Date().getTime();
				fn.apply(this,arguments);
			}, remainTime);
		}
	}
	return _throttle
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
export function isImgFormat(file) {
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

/**
 * 委托文件、委托单返回的路径
 * @param {String} file [传入后台返回的路径字符串]
 * @param {String} suffix [文件后缀]
 * * @param {Boolean} handleSuffix [是否处理文件后缀，默认处理]
 */
export function fileShowPath(file, suffix , handleSuffix=true) {
	if (file) {
	
		if(file.lastIndexOf('.')>0 && handleSuffix){
			file=file.substring(0,file.lastIndexOf('.'))+".";
		}
		
		let fileUrl = file + suffix; //文件路径
		// let reg = new RegExp("hall"); //匹配服务端的 hall字符串，准备替换
		// let newUrl = baseUrl.replace(reg, fileUrl);
		let newUrl=baseUrl+fileUrl;
		return newUrl;
	} else {
		return '';
	}
}

/**Start
 * 下载单个pdf文件
 * @param {String} url [文件链接]
 * @param {String} name [文件名字]
 */
export function fileLinkToStreamDownload(url, name) {
	let fileName = name;
	let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\/])+$/;
	if (!reg.test(url)) {
		throw new Error('传入参数不合法,不是标准的文件链接',url)
	} else {
		let xhr = new XMLHttpRequest()
		xhr.open('get', url, true)
		xhr.setRequestHeader('Content-Type', `application/pdf`)
		xhr.responseType = 'blob'
		let that = this
		xhr.onload = function() {
			if (this.status == 200) {
				//接受二进制文件流
				var blob = this.response
				downloadExportFile(blob, fileName)
			}
		}
		xhr.send()
	}
}

function downloadExportFile(blob, tagFileName) {
	let downloadElement = document.createElement('a')
	let href = blob
	if (typeof blob == 'string') {
		downloadElement.target = '_blank'
	} else {
		href = window.URL.createObjectURL(blob) //创建下载的链接
	}
	downloadElement.href = href
	downloadElement.download = tagFileName
	//下载后文件名
	document.body.appendChild(downloadElement)
	// 判断是否是 IE
	if (navigator.msSaveOrOpenBlob) {
		navigator.msSaveOrOpenBlob(blob, tagFileName)
	} else {
		downloadElement.click()
	}
	// downloadElement.click() //点击下载
	document.body.removeChild(downloadElement) //下载完成移除元素
	if (typeof blob != 'string') {
		window.URL.revokeObjectURL(href) //释放掉blob对象
	}
}
/*End*/

/**Start
 * 批量下载pdf文件并打包成一个zip文件
 * @param {Array} arr [多个pdf文件路径的数组]
 */
export function BatchPdfDownload(arr) {
	const zip = new JSZip()
	const cache = {}
	const promises = []
	arr.forEach(item => {
		const promise = getFile(item).then(data => {
			const arr_name = item.split('/') // 下载文件, 并存成ArrayBuffer对象
			const file_name = arr_name[arr_name.length - 1] // 获取文件名
			// .folder("name")这个是把文件放在一个文件夹，不需要可以删去
			zip.folder("证书文件夹").file(file_name, data, {
				binary: true
			}) // 逐个添加文件
			cache[file_name] = data
		})
		promises.push(promise)
	})
	Promise.all(promises).then(() => {
		zip.generateAsync({
			type: 'blob'
		}).then(content => {
			// 生成二进制流
			saveAs(content, '证书文件.zip') // 利用file-saver保存文件  自定义文件名
		})
	})
}

function getFile(url) {
	return new Promise((resolve, reject) => {
		let obj = {
			method: 'get',
			url,
			// responseType: 'blob'
			responseType: 'arraybuffer'
		}
		axios(obj).then(data => {
			resolve(data.data)
		})
		.catch(error => {
			reject(error.toString())
		})
	})
}
/*End*/

/**
 * 点击下载文件事件
 * @param {string} src [本地文件路径，放在public目录的静态文件]
 */
export function downFile(src){
	let prefixUrl = `${process.env.BASE_URL}`+src;
	let link = document.createElement("a");
	//创建一个a标签
	link.style.display = "none";
	//将a标签隐藏
	link.href = prefixUrl;
	//给a标签添加下载链接  "域名+接口"  safe是一个动态的域名  后面的接口替换成你自己的下载接口
	link.setAttribute("download", name);
	// 此处注意，要给a标签添加一个download属性，属性值就是文件名称 否则下载出来的文件是没有属性的，空白白
	document.body.appendChild(link);
	//将上面创建的a标签加入到body的尾部
	link.click();
}

/**
 * 时间戳转换日期
 * @param {string} timestamp [10位或者13位的 时间戳]
 */
export function timestampToTime(timestamp) {
	if(timestamp.length<13){
		timestamp=timestamp * 1000;
	}
	var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var D = date.getDate() + ' ';
	var h = date.getHours() + ':';
	var m = date.getMinutes() + ':';
	var s = date.getSeconds();
	return Y + M + D + h + m + s;
}

/**
 * 用于ElementUI 表单验证规则的集合，自己写特定的规则，常用规则可在type直接调用
 * @param  rule	[源描述符中的验证规则，对应于正在验证的字段名称。它总是被分配一个field带有被验证字段名称的属性。]
 * @param  value [正在验证的源对象属性的值。]
 * @param  callback [验证完成后调用的回调函数。它期望传递一个Error实例数组来指示验证失败。如果检查是同步的，可以直接返回一个falseorError或Error Array]
 * *** 验证里面的type 可选email、string、number、boolean、url、date、any等等
 * 详细参考 https://github.com/yiminghe/async-validator（需要翻墙）
 */
export const formValidation = {
	//判断只能输入1开头第二位数字是3456789中一个，后面九位数随便填，总共十一位电话号码。
	mobile: (rule, value, callback) => {
		var patrn = /^1[3456789]\d{9}$/;
		if (patrn.test(value) == false) {
			return callback(new Error('请输入正确的11位手机号码！'));
		} else {
			return callback();
		}
	},
	//座机号正则，需要加区号
	phone: (rule, value, callback) => {
		var patrn = /^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/;
		if (patrn.test(value) == false) {
			return callback(new Error('格式不正确！如：0111-8137664'));
		} else {
			return callback();
		}
	},
}


