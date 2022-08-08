import Vue from 'vue'
import App from './App.vue'

//引入路由
import VueRouter from 'vue-router'
import router from './router'
Vue.use(VueRouter)

// 引入ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//引入axios
import axios from 'axios'
Vue.prototype.axios=axios

//引入store
import store from './store'

//用户登录权限管理文件
import './permission.js'

//引入 自定义指令
import './utils/customDirective'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router:router,
  store,
  beforeCreate(){
  	  Vue.prototype.$bus=this
  }
}).$mount('#app')
