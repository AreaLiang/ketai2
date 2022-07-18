<template>
	<div class="">
		<el-button type="success" plain @click="downloadTb()">点击再次下载表格</el-button>
	</div>
</template>

<script>
	import {downFile,throttle} from '@/utils'
	export default {
		name: 'entrustTbDL', //业务委托表格下载
		data() {
			return {

			}
		},
		methods: {
			downloadTb() {
				const downFun=()=>{downFile('/file/wtb.doc')};
				throttle(downFun);//节流函数
			}
		},
		mounted() {
			downFile('/file/wtb.doc')
		}
	}
</script>

<style scoped lang="less">

</style>
