<template>
	<div class="">
		<el-dialog title="检测委托书" :visible.sync="dialogFormVisible" :modal-append-to-body="false" custom-class="entrustFileDialog">
			<iframe class="pdf-show" :src="wordUrl" width="100%" height="700"></iframe>
		</el-dialog>
	</div>
</template>

<script>
	import {fileShowPath} from '@/utils'
	export default {
		name: 'entrustFileDialog',//委托文件	
		data() {
			return {
				dialogFormVisible:false,
				wordUrl:'',//pdf链接
			}
		},
		mounted(){
			//监听 点击改行时候返回的数据
			this.$bus.$on("currentRowData",(data)=>{
				let jsonData=JSON.parse(JSON.stringify(data));//转换成JSON格式
				//获取后台返回文件路径，pdf和doc文件不一样，返回路径不一样
				if(jsonData.rawData.orderFile){
					this.wordUrl=fileShowPath(jsonData.rawData.orderFile,'.pdf');
				}else{
					this.wordUrl=fileShowPath(jsonData.rawData.orderFilePdf,'.pdf');
				}
			})
		}
	}
</script>

<style lang="less">
.entrustFileDialog{
	width: 80%;
	height: 800px;
	margin-top:5vh !important;
	.el-dialog__body{
		padding: 10px 10px;
	}
}
</style>
