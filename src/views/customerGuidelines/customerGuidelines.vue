<template>
	<div>
		<el-button class="downbtn" type="primary" plain @click="downloadTb()">点击下载用户指南</el-button>
		<iframe class="pdf-show" src="/file/khzczy.pdf" width="100%" height="600"></iframe>
	</div>
</template>

<script>
	import {downFile,throttle} from '@/utils'
	export default {
		name: 'customerGuidelines', //客户注册指引 表格下载
		methods: {
			downloadTb:throttle(function(){//节流函数
				downFile('/file/khzczy.pdf');
			})
		}
	}
</script>

<style scoped lang="less">
.downbtn{
	margin: 10px 0;
}
</style>
