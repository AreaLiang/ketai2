<template>
	<div class="diglogUserInfoCg">
		<el-dialog title="修改信息" :visible.sync="dialogFormVisible" :modal-append-to-body="false"
			custom-class="userInfoCg-diglog">
			<el-row :gutter="20">
				<el-col :span="14">
					<!-- 表单 -->
					<formUserInfo :userdata="userdata" :dialogFormVisible="dialogFormVisible" ref="modifyUerInfo">
					</formUserInfo>
					<div class="license-box">
						<div class="business-license">
							<span>营业执照</span>
						</div>
						<div class="business-license">
							<el-upload class="upload-UserInfoCg" ref="upload" action="#" :file-list="fileList"
								:limit="1" accept=".jpg,.jpeg,.png" :before-upload="beforeLicenseUpload"
								:http-request="uploadLicense">
								<el-button slot="trigger" size="small" type="primary">选择营业执照文件</el-button>
							</el-upload>
						</div>
					</div>
					<div>
						<el-button type="primary" @click="submitCgUserInfo()">提交更改</el-button>
					</div>
				</el-col>
				<el-col :span="10">
					<div class="lc-img-box">
						<img :src="licenseUrl" class="licensePic" alt="">
					</div>
				</el-col>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
	import formUserInfo from "./formUserInfo"
	import QS from 'qs'
	import {uploadCertFileApi,cgUserInfoApi} from "@/request/api"
	import {getBase64} from "@/utils"
	// import { changeProfessionArray } from "@/utils/userInfo"

	import {
		mapGetters,
		mapState
	} from "vuex"
	export default {
		name: 'diglogUserInfoCg', //信息修改 的弹窗
		data() {
			return {
				dialogFormVisible: false,
				fileList: [],
				certFile: '',
				licenseUrl:''
			}
		},
		components: {
			formUserInfo
		},
		computed: {
			...mapGetters(["isCertification"]),
			...mapState({
				userdata: state => {
					return {
						...state.userInfo
					}
				}
			})
		},
		methods: {
			//证件照上传
			uploadLicense(res) {

				//照片转base64格式
				getBase64(res.file).then((data)=>{
					this.licenseUrl=data;
				});
					
				let params = new FormData();
				params.append('file', res.file);
				//调用接口上传证件
				uploadCertFileApi(params).then((data) => {
					this.certFile = data.data.certFile;
				})
			},
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
			//提交 修改用户信息
			submitCgUserInfo() {

				//解构
				let userInfoFrom = this.$refs['modifyUerInfo'].ruleForm; //从表单组件中获取用户信息
				let {
					address,
					contactName,
					phone,
					cellPhone,
					mail,
					profession,
					userName
				} = {
					...userInfoFrom
				};
				//整理需要发送的用户信息
				let data = {
					name: userName,
					contact: contactName,
					phone: phone,
					address: address,
					email: mail,
					mobile: cellPhone,
					certificate: this.certFile,
					business: JSON.stringify(profession)
				}

				console.log("修改信息：", data)
				cgUserInfoApi(data).then((data) => {
					if (data.code == "20000") {
						this.$message.success("修改成功");
						this.dialogFormVisible=false;
					} else {
						this.$message.success("修改失败");
					}
				})

			}
		},
		mounted() {

		}
	}
</script>

<style lang="less">
	.diglogUserInfoCg {
		.license-box {
			overflow: hidden;
			text-align: left;
		}

		.business-license {
			display: inline-block;
			margin: 0 10px;
		}

		.userInfoCg-diglog {
			width: 60%;
			min-width: 900px;
		}
		
		.licensePic{
			width: 100%;
		}
		
		.lc-img-box{
			height: 450px;
			background-color: #b5b5b5;
		}

		//上传按钮 的样式
		.upload-UserInfoCg {
			height: 38px;
			margin: 10px 0;
			min-width: 328px;
		}

		.el-upload-list__item:first-child,
		.el-upload-list__item {
			margin: 0;
		}

		.el-upload {
			width: 20%;
		}

		.el-upload-list {
			display: inline-block;
			// width: 70%;
			vertical-align: middle;
			margin-left: 80px;
		}
	}
</style>
