<template>
	<div class="acceptance-order" >
		<el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body="false" custom-class="acceptanceDialog">
			<div v-loading='loading'>
				<div class="acceptancePic">
					<img :src="imgUrl" alt="">
				</div>
				<div class="uploadbox">
					<el-upload ref="acceptanceOrder" class="upload-acceptance-order" action="#"
						accept=".jpg,.jpeg,.png" :before-upload="beforeLicenseUpload"
						:http-request="uploadAcceptanceOrder" style="margin: 10px 0"
						:file-list="fileList" >
						<el-button slot="trigger" size="small" type="primary">选择验收单</el-button>
					</el-upload>
				</div>
				<div slot="footer" class="dialog-footer">
				    <el-button @click="dialogFormVisible = false">取 消</el-button>
				    <el-button type="primary" @click="subAcceptanceOrder()">提 交</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {isImgFormat,fileShowPath,throttle} from "@/utils"
	import { uploadTempFileApi ,modifyCheckFileApi} from "@/request/api"
	export default{
		name:'acceptanceDialog',//完工验收单
		data(){
			return{
				dialogFormVisible:false,
				imgUrl:'',//照片显示的链接
				tempFile:'',//验工单的文件路径
				data:{},
				fileList:[],
				loading: false
			}
		},
		methods:{
			//上传证件文件前，对文件类型做判断
			beforeLicenseUpload(file) {
				let uploadFiles=this.$refs['acceptanceOrder'].uploadFiles;
				if(uploadFiles.length>1){
					uploadFiles.splice(0, 1); //删除上一个照片
				}
				isImgFormat(file);//调用公共校验方法
			},
			//完工验收单上传
			uploadAcceptanceOrder(res){
				let params = new FormData();
				params.append('file', res.file);
				this.loading=true;
				//调用完工单上传接口
				uploadTempFileApi(params).then((data) => {
					if(data.code=="20000"){
						this.tempFile=data.data.tempFile;
						this.imgUrl=fileShowPath(data.data.tempFile,'');
					
					}else{
						this.$message.error("上传失败");
					}
					this.loading=false;
				}).catch(e=> this.loading=false)
			},
			//提交验收单信息
			subAcceptanceOrder(){
				let rowData={...this.data};
				if(this.tempFile){//如果已经上传文件
					const submitCheckFile=()=>{
						modifyCheckFileApi({
							id:rowData.id,
							checkFile:this.tempFile
						}).then((data)=>{
							if(data.code=="20000"){
								this.$message.success("上传成功");
								this.dialogFormVisible = false;//关闭dialog
								this.$bus.$emit('pageNumber',this.currentPage);//刷新页面
							}else{
								this.$message.error("上传失败");
							}
						})
					}
					throttle(submitCheckFile,2000)//节流函数
				}else{
					this.$message.warning("请上传验收单");
				}
			}
		},
		mounted(){
			this.$bus.$on("currentRowData",(data)=>{
				let res={...data.rawData};
				this.fileList=[];//清除upload的默认地址
				this.data=res;
				this.tempFile=res.checkFile;
				this.imgUrl=fileShowPath(res.checkFile,'');
				if(this.imgUrl){
					this.fileList.push({name:this.imgUrl,url:this.imgUrl});
				}
			})
		},
		props:{
			currentPage: {
				type: Number,
				default: 1
			}
		}
	}
</script>

<style lang="less">
	.acceptance-order{
		.el-upload-list__item {
		  transition: none ;
		}
		.acceptancePic{
			width: 100%;
			height: 450px;
			overflow: auto;
			img{
				width: 100%;
			}
		}
		.uploadbox{
			margin-top: 10px;
			height: 50px;
			position: relative;
			.el-upload-list--text{
				height: 30px;
				overflow: hidden;
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
