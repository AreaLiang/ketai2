<template>
	<div class="">
		<el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body="false">
			<iframe class="pdf-show" :src="diglogUrl" width="500" height="500"></iframe>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'entrustFileDialog',
		data() {
			return {
				dialogFormVisible:false,
				diglogUrl:''
			}
		},
		components: {

		},
		mounted(){
			this.$bus.$on("currentRowData",(data)=>{
				let rawData={...data.rawData};
				this.diglogUrl="http://192.168.0.103:9010/"+rawData.orderFilePdf;
			})
		}
	}
</script>

<style scoped lang="less">

</style>
