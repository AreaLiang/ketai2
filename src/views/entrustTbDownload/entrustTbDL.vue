<template>
	<div class="">
		<el-button class="downbtn" type="primary" plain @click="downloadTb()">点击下载表格</el-button>
		<iframe class="pdf-show" src="/file/wtb.pdf" width="100%" height="600"></iframe>
	</div>
</template>

<script>
	import {downFile,throttle} from '@/utils'
	export default {
		name: 'entrustTbDL', //业务委托表格下载
		methods: {
			downloadTb() {
				const downFun=()=>{downFile('/file/wtb.doc')};
				throttle(downFun);//节流函数
			}
		},
		mounted() {
			// downFile('/file/wtb.doc')
		}
	}
</script>

<style scoped lang="less">
.downbtn{
	margin: 10px 0;
}
</style>
