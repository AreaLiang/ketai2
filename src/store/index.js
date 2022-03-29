import Vuex from "vuex"
import Vue from 'vue'
import axios from 'axios'
import {asyncRouter} from '@/router'
import {navRouter,ckUserInfo} from '@/utils/permissionsTb'

const actions = {
	// 用户权限控制
	authorityNav(context,value){
		
		ckUserInfo(value);
		// context.commit('AuthorityNav',true);
		
	}
}
const mutations = {
	//保存用户的信息
	UserInfo(state,value){
		state.userInfo.push(value)
	},
	// 用户权限控制
	AuthorityNav(state,useStatus){
		let data=asyncRouter;//获取所有动态路由
		
		//过滤后的动态导航信息
		let newRouter=new navRouter(data,useStatus);
		state.permissionRoutes=newRouter.call();
	}
}
const state = {
	userInfo:[],//用户信息
	permissionRoutes:[], //过滤后的权限路由表
}

const getters={
	
}

Vue.use(Vuex)
export default new Vuex.Store({
	actions,
	mutations,
	state,
	getters
})
