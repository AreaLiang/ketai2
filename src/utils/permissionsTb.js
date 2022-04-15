import axios from 'axios'
// import {ckUserInfoApi} from '@/api'

/**
 * 过滤路由表的函数，此方法未完善，只操作数组前面第一个对象
 * @param {Array} routeList [需要添加的路由表]
 * @param {String} identity [用户的中文状态信息，如 “正常” ，“未验证”]
 */

function navRouter(routeList, identity){
	console.log("路由表",routeList, identity)
	//过滤 符合条件的路由导航 路由
	let filterRouter = routeList[0].children.filter((p) => {
		return p.meta.isAuthority == identity;
	})
	
	let originalRoute = routeList[0]; //原路由
	originalRoute.children = filterRouter //替换原路由的子路由
	return originalRoute;
}

export {navRouter};
