<template>
	<div class="">
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
				window.open('http://customer.gdketai.com/file/wordDocument/wtb.doc');
			}
		},
		mounted(){
			window.open('http://customer.gdketai.com/file/wordDocument/wtb.doc');
		}
	}
</script>

<style scoped lang="less">
	
</style>
