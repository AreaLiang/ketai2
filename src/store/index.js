import Vuex from "vuex"
import Vue from 'vue'
import axios from 'axios'
import {asyncRouter,errorRouter} from '@/router'
import {ckUserInfoApi} from "@/request/api"

const actions = {
	// 用户权限控制
	checkUserInfo(context,token){
		return ckUserInfoApi(token).then((data) => {
			if (data.code == "Ok" ) {
				context.commit('UserInfo',data)
				return data.data.status
			}else return false
		})
	}
}
const mutations = {
	//登录后保存用户信息
	Login(state, value){
		state.userInfo = value.data.customer;
		state.token = value.data.token;
	},
	//保存用户的信息
	UserInfo(state, value) {
		state.userInfo = value.data;
	},
	// 权限路由控制
	GenerateRoutes(state, status) {
		let asyncRouteList = _.cloneDeep(asyncRouter); //获取动态路由
		asyncRouteList=asyncRouteList.filter( p => {
			if(p.meta.authorityStatus =='all' || p.meta.authorityStatus == status){// all 是全部状态都有权限
				if(p.children.length>0){//判断是否有子级
					p.children=p.children.filter( item =>{//过滤没有权限的子路由
						return item.meta.authorityStatus==status;
					})
				}
				return true;
			}
		});
		asyncRouteList=[...asyncRouteList,...errorRouter];//把 错误路由数组 加载进去
		
		//过滤后的动态导航信息	
		state.permissionRoutes = asyncRouteList;
	}
}

const state = {
	userInfo: [], //用户信息
	token: '',
	permissionRoutes: [], //过滤后的权限路由表
}

const getters = {
	isCertification: state => {return {...state.userInfo}.status}
}

Vue.use(Vuex)
export default new Vuex.Store({
	actions,
	mutations,
	state,
	getters
})
