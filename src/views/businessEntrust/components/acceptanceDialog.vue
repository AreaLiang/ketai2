<template>
	<div class="acceptance-order">
		<el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body="false" custom-class="acceptanceDialog">
			<div class="acceptancePic">
				<img :src="imgUrl" alt="">
			</div>
			<div class="uploadbox">
				<el-upload  class="upload-acceptance-order" action="#"
					:limit="1" accept=".jpg,.jpeg,.png" :before-upload="beforeLicenseUpload"
					:http-request="uploadAcceptanceOrder" style="margin: 10px 0;">
					<el-button slot="trigger" size="small" type="primary">选择验收单</el-button>
				</el-upload>
			</div>
			 <div slot="footer" class="dialog-footer">
			    <el-button @click="dialogFormVisible = false">取 消</el-button>
			    <el-button type="primary" @click="subAcceptanceOrder()">提 交</el-button>
			  </div>
		</el-dialog>
	</div>
</template>

<script>
	import {getBase64} from "@/utils"
	import { uploadTempFileApi ,modifyCheckFileApi} from "@/request/api"
	export default{
		name:'acceptanceDialog',//完成验收单
		data(){
			return{
				dialogFormVisible:false,
				imgUrl:'',
				tempFile:'',
				data:{}
			}
		},
		methods:{
			//上传证件文件前，对文件类型做判断
			beforeLicenseUpload(file) {
				const isJEPG = file.type === 'image/jpeg';
				const isJPG = file.type === 'image/jpg';
				const isPNG = file.type === 'image/png';
			
				if (isJEPG || isJPG || isPNG) {
					return true
				} else {
					this.$message.error('证件只能是上传图片格式!');
					return false
				}
			},
			//完成验收单上传
			uploadAcceptanceOrder(res){
				//照片转base64格式
				getBase64(res.file).then((data)=>{
					this.imgUrl=data;
				});
				
				let params = new FormData();
				params.append('file', res.file);
				//调用接口上传证件
				uploadTempFileApi(params).then((data) => {
					console.log("完成验工单",data)
					if(data.code=="20000"){
						this.tempFile=data.data.tempFile;
					}else{
						this.$message.error("上传失败")
					}
				})
			},
			subAcceptanceOrder(){
				console.log({...this.data}.id)
				let rowData={...this.data};
				if(this.tempFile){
					modifyCheckFileApi({
						id:rowData.id,
						checkFile:this.tempFile
					}).then((data)=>{
						if(data.code=="20000"){
							this.$message.success("上传成功");
							this.dialogFormVisible = false;
							this.$bus.$emit('pageNumber',1);
						}else{
							this.$message.error("上传失败");
						}
					})
				}else{
					this.$message.warning("请上传验收单");
				}
			}
		},
		mounted(){
			this.$bus.$on("currentRowData",(data)=>{
				this.data=data.rawData;
				this.tempFile={...data.rawData}.checkFile;
			})
		}
	}
</script>

<style lang="less">
	.acceptance-order{
		.acceptancePic{
			width: 100%;
			height: 450px;
			overflow: auto;
			img{
				width: 100%;
			}
		}

		.upload-entrust{
			height: 38px;
			margin: 10px 0;
			min-width: 328px;
		}
		.el-upload-list__item:first-child,
		.el-upload-list__item{
			margin: 0;
		}
		.el-upload{
			width: 20%;
		}
		.el-upload-list{
			display: inline-block;
			width: 70%;
			vertical-align: middle;
			margin-left: 20px;
		}
		.acceptanceDialog{
			width: 70%;
		}
	}
</style>
