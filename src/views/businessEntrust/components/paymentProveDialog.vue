<template>
	<div class="payment-prove">
		<el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body="false" custom-class="paymentProveDialog">
			<div v-loading="loading">
				<div class="paymentProvePic">
					<img :src="imgUrl" alt="">
				</div>
				<div class="uploadbox" v-if="!isUploadPay">
					<el-upload ref="uploadPaymentProve"  class="upload-payment-prove" action="#"
						 accept=".jpg,.jpeg,.png" :before-upload="beforePaymentProve"
						:http-request="uploadPaymentProve" :file-list="fileList" style="margin: 10px 0;">
						<el-button slot="trigger" size="small" type="primary">上传支付证明</el-button>
					</el-upload>
				</div>
				<div slot="footer" v-if="!isUploadPay" class="dialog-footer">
				    <el-button @click="dialogFormVisible = false">取 消</el-button>
				    <el-button type="primary" @click="submitPaymentProve()">提 交</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { isImgFormat,fileShowPath ,throttle} from "@/utils"
	import {baseUrl,modifyPayFileApi,uploadTempFileApi} from '@/request/api'
	
	export default{
		name:'paymentProveDialog',//支付证明
		data(){
			return{
				dialogFormVisible:false,
				imgUrl:"",
				data:'',
				payFile:'',
				isUploadPay:false,
				fileList:[],
				loading:false
			}
		},
		methods: {
			//上传支付证明
			uploadPaymentProve(res) {
				let params = new FormData();
				params.append('file', res.file);
				//调用上传支付证明接口
				uploadTempFileApi(params).then((data) => {
					console.log("支付证明",data)
					if(data.code=="20000"){
						this.payFile=data.data.tempFile;
						this.imgUrl=fileShowPath(data.data.tempFile,'');
					}else{
						this.$message.error("上传失败");
					}
				})
			},
			//提交支付证明
			submitPaymentProve(){
				
				let rowData={...this.data};
				if(this.payFile){//如果已经上传文件
					const modifyPayFile = ()=>{
						this.loading=true;
						modifyPayFileApi({
							id:rowData.id,
							payFile:this.payFile
						}).then((data)=>{
							if(data.code=="20000"){
								this.$message.success("上传成功");
								this.dialogFormVisible = false;
								this.$bus.$emit('pageNumber',this.currentPage);
							}else{
								this.$message.error("上传失败");
							}
						}).finally(()=>{this.loading=false});
					}
					
					throttle(modifyPayFile,2000);
				}else{
					this.$message.warning("请上传验收单");
				}
			},
			//上传前，校验是否为照片格式
			beforePaymentProve(file){
				this.loading=true;
				let uploadFiles=this.$refs['uploadPaymentProve'].uploadFiles;
				if(uploadFiles.length>1){
					uploadFiles.splice(0, 1); //删除上一个照片
				}
				isImgFormat(file);//调用公共校验方法
				this.loading=false;
			}
		},
		mounted(){
			this.$bus.$on("currentRowData",(data)=>{
				let res={...data.rawData};
				this.data=res;
				this.imgUrl='';//清空支付证明链接
				this.fileList=[];//清除upload的默认地址
				
				if(res.payFile){
					this.isUploadPay=true;
					this.payFile=res.payFile;
					this.imgUrl=fileShowPath(res.payFile,'');
				}else{
					this.isUploadPay=false;
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
	.payment-prove{
		.paymentProvePic{
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
		.paymentProveDialog{
			width: 70%;
		}
		.el-upload-list--text{
			height: 30px;
			overflow: hidden;
		}
	}
</style>
