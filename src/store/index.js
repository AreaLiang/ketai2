import Vuex from "vuex"
import Vue from 'vue'
import axios from 'axios'

const actions = {
	
}
const mutations = {
	UserInfo(state,value){
		state.userInfo=value
	}
}
const state = {
	userInfo:{}
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
