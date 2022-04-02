<template>
	<div class="entrustDiglog">
		<el-dialog title="业务委托单" :visible.sync="dialogFormVisible" :modal-append-to-body="false"  custom-class="entrust-diglog">
			<el-row :gutter="30">
				<el-col :span="12">
					<el-form :model="addEntrustForm" label-position="top">
						<el-row :gutter="30">
							<el-col :span="12">
								<el-form-item label="委托单位" :label-width="formLabelWidth" >
									<el-input v-model="addEntrustForm.entrustCompany" autocomplete="off" disabled></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="公司地址" :label-width="formLabelWidth">
									<el-input v-model="addEntrustForm.adress" autocomplete="off" disabled></el-input>
								</el-form-item>
							</el-col>
						</el-row>
					
						<el-row :gutter="30">
							<el-col :span="12">
								<el-form-item label="电子邮箱" :label-width="formLabelWidth">
									<el-input v-model="addEntrustForm.email" autocomplete="off" disabled></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="公司座机" :label-width="formLabelWidth">
									<el-input v-model="addEntrustForm.phone" autocomplete="off" disabled></el-input>
								</el-form-item>
							</el-col>
						</el-row>
					
						<el-row :gutter="30">
							<el-col :span="12">
								<el-form-item label="联系人 " :label-width="formLabelWidth">
									<el-input v-model="addEntrustForm.contact" autocomplete="off"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="联系手机号" :label-width="formLabelWidth">
									<el-input v-model="addEntrustForm.contactCellphone" autocomplete="off"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
					
						<el-row>
							<el-col :span="24">
								<el-form-item label="备注" :label-width="formLabelWidth">
									<el-input type="textarea" v-model="addEntrustForm.remark" :rows="8"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						
						<el-row>
							<el-col :span="24">
								<el-upload
								  class="upload-entrust"
								  action="https://jsonplaceholder.typicode.com/posts/"
								  :on-change="handleChange"
								  :file-list="fileList">
								  <el-button size="small" type="primary">点击上传</el-button>
								</el-upload>
							</el-col>
						</el-row>
					</el-form>
				</el-col>
				
				<el-col :span="12">
					<div class="pdfShow"></div>
				</el-col>
			</el-row>
			<div slot="footer" class="dialog-footer">
			<!-- 	<el-button @click="dialogFormVisible = false">取 消</el-button> -->
				<el-button type="primary" @click="dialogFormVisible = false">提交委托单</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'addEntrustDiglog', //新建业务委托 弹出框
		data() {
			return {
				fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
				dialogFormVisible: false,
				addEntrustForm: {
					entrustCompany: '',
					adress: '',
					email: '',
					phone: '',
					contact: "",
					contactCellphone: '',
					remark: ''
				},
				formLabelWidth: '120px'
			}
		},
		components: {

		},
		methods: {
			handleChange() {
				
			}
		},
		mounted() {

		},

	}
</script>

<style lang="less">
	.entrustDiglog {
		.el-form-item{
			text-align: left;
			margin-bottom: 0;
		}
		.el-form--label-top .el-form-item__label{
			padding: 0;
		}
		.entrust-diglog{
			width: 60%;
		}
		.pdfShow{
			background: #ccc;
			height: 460px;
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
	}
	
</style>
