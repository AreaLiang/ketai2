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
	import {isImgFormat,throttle} from "@/utils"
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
				if(!isImgFormat(file)){
					this.tempFile='';
					this.imgUrl='';
					return false;
				}
			},
			//完工验收单上传
			uploadAcceptanceOrder(res){
				let params = new FormData();
				params.append('file', res.file);
				this.loading=true;
				//调用完工单上传接口
				this.api.uploadTempFileApi(params).then((data) => {
					if(data.code=="Ok" ){
						this.tempFile=data.data.tempFile;// 赋值验工单的文件路径
						this.imgUrl=this.baseUrl(data.data.tempFile);//上传后 右侧显示验工单的文件
					}else{
						this.$message.error("上传失败");
					}
					this.loading=false;
				}).catch(e=> this.loading=false)
			},
			//提交验收单信息
			subAcceptanceOrder:throttle(function(){//节流函数
				let rowData={...this.data};
				if(this.tempFile){//如果已经上传文件
					this.api.modifyCheckFileApi({
						id:rowData.id,
						checkFile:this.tempFile
					}).then((data)=>{
						if(data.code=="Ok" ){
							this.$message.success("上传成功");
							this.dialogFormVisible = false;//关闭dialog
							this.$bus.$emit('pageNumber',this.currentPage);//刷新页面
						}else{
							this.$message.error("上传失败");
						}
					})
				}else{
					this.$message.warning("请上传验收单");
				}
			})
		},
		mounted(){
			this.$bus.$on("currentRowData",(data)=>{//当前行操作，返回当前操作行的数据
				let res={...data};
				this.fileList=[];//清除upload的默认地址
				this.data=res;
				
				this.tempFile=res.checkFile; //赋值 验工单的文件路径
				this.imgUrl=this.baseUrl(res.checkFile);//右边验工单文件的 显示路径
				if(this.imgUrl){//如果已经上传过，则显示已经上传的文件名
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
