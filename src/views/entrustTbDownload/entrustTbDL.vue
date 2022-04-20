<template>
	<div class="">
		<!-- <iframe class="pdf-show" src="http://www.zhaoqing.gov.cn/attachment/0/150/150924/2688824" width="500" height="500"></iframe> -->
		<el-button type="success" plain @click="downloadTb()">点击下载表格</el-button>
	</div>
</template>

<script>
	
	export default {
		name: 'entrustTbDL',//业务委托表格下载
		data() {
			return {

			}
		},
		methods:{
			downloadTb(){
				window.open('http://www.zhaoqing.gov.cn/attachment/0/150/150924/2688824.doc');
			}
		},
		mounted(){
			window.open('http://www.zhaoqing.gov.cn/attachment/0/150/150924/2688824.doc');
		}
	}
</script>

<style scoped lang="less">
	
</style>
