<template>
	<div class="licenseUpload" :class="{hideAdd:upLoadDisabled}">
		<el-upload action="#" list-type="picture-card" :limit="1" ref='licenseUpload' accept=".jpg,.jepg,.png" :disabled="upLoadDisabled"
			:http-request="licenseUpload" :before-upload="beforeUpload" :file-list="fileList">
			<i slot="default" class="el-icon-plus"></i>
			<div slot="file" slot-scope="{file}">
				<img class="el-upload-list__item-thumbnail" :src="file.url">
				<span class="el-upload-list__item-actions">
					<span class="el-upload-list__item-preview"
						@click="handlePictureCardPreview(file)">
						<i class="el-icon-zoom-in"></i>
					</span>
					<span v-if="!upLoadDisabled" class="el-upload-list__item-delete"
						@click="handleRemove(file)">
						<i class="el-icon-delete"></i>
					</span>
				</span>
			</div>
		</el-upload>
		
		<el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false">
			<img width="100%" :src="dialogImageUrl">
		</el-dialog>
	</div>
</template>

<script>
	import {isImgFormat} from "@/utils"
	export default{
		name:'licenseUpload', //执照上传组件
		data(){
			return{
				dialogImageUrl: '', //放大照片的链接
				dialogVisible: false, //放大查看照片的会话框
				fileUrl: '', //执照文件路径
				fileList:[],//默认显示路径
				isShowAdd:false //是否显示加号
			}
		},
		props:['firstFile','upLoadDisabled'],
		methods:{
			//upload 默认显示格式转换
			firstFileList:url => url ? [{url:url}] : [],
			//上传前，校验是否为照片格式
			beforeUpload: file => isImgFormat(file), 
			//文件上传删除功能
			handleRemove(file, name) {
				let uploadFiles, index;
				uploadFiles = this.$refs['licenseUpload'].uploadFiles;
				this.dialogImageUrl = '';
				this.fileUrl = ''; //清除后台返回的文件链接
				
				index = uploadFiles.indexOf(file);
				uploadFiles.splice(index, 1); //删除照片
			},
			//文件放大查看功能
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			//上传营业执照
			licenseUpload(res) {
				let params = new FormData();
				params.append('file', res.file);
			
				this.api.uploadCertFileApi(params).then((data) => {
					if (data.code == "Ok" ) {
						this.fileUrl = data.data.certFile; //保存后台返回的 营业执照地址
					} else {
						this.$message.error("营业执照上传失败");
					}
				});
			},
		},
		mounted() {
			this.fileList=this.firstFileList(this.firstFile);// 上传 默认显示图片，转换成指定的格式
		}
	}
</script>

<style scoped lang="less">
	// /deep/.el-upload-list__item {
	//   transition: none !important;
	// }
	// /deep/.el-upload-list__item-thumbnail {
	//     /* 图片在方框内显示长边 */
	//     object-fit: scale-down !important;
	// }
	
	.hideAdd /deep/.el-upload--picture-card {
	  display: none;
	}
</style>