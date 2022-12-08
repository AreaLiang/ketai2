<template>
	<div class="pdf-box">
		<iframe class="pdf-show" :src="getUrl" width="500" height="500"></iframe>
	</div>
</template>

<script>
	export default {
		name: 'PdfView',//服务项列表
		computed:{
			getUrl(){
				return this.baseUrl("/file/pdfDocument/ywb.pdf");
			}
		}
	}
</script>

<style scoped lang="less">
	.pdf-box {
		height: 98%;
		width: 100%;
	}
	.pdf-show{
		height: 100%;
		width: 100%;
	}
	
</style>
