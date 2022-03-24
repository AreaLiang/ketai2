import router from './router'
import store from'./store'
import axios from 'axios'
import NProgress from 'nprogress' // 引入头部进度条
import 'nprogress/nprogress.css' // 进度条样式

NProgress.configure({
	showSpinner: false
}) // 进度条

router.beforeEach(async(to, from, next) => {
	NProgress.start() //开启进度条
	
	next()
	NProgress.done()
});
