import Vue from 'vue'
import {
	Message
} from 'element-ui';

/**
 * 自定义指令 节流函数
 * @param {Number} xxx [可选参数，限定多少时间内只执行一次]
 * 调用 v-throttle 或者 v-throttle = "2000"
 */
Vue.directive('throttle', {
	bind: (el, binding) => {
		let time = binding.value; //限定多少时间内只执行一次

		if (!time) time = 2000; //如果没有设置，默认2000 毫秒 

		let cbFun;
		el.addEventListener('click', event => {
			if (!cbFun) { // 第一次执行
				cbFun = setTimeout(() => {
					cbFun = null;
				}, time)
			} else {
				Message.error("提交过快")
				event && event.stopImmediatePropagation();
			}
		}, true)
	}
})

/**
 * 自定义指令 自动聚焦 只适用于Element UI框架，其他需要做调整
 */
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.children[1].focus()
  }
})