<template>
	<div class="entrustDiglog">
		<el-dialog title="业务委托单" :visible.sync="dialogFormVisible" :modal-append-to-body="false"  custom-class="entrust-diglog">
			<el-row :gutter="30">
				<el-col :span="12">
					<el-form :model="addEntrustForm" label-position="top">
						<el-row :gutter="30">
							<el-col :span="12">
								<el-form-item label="委托单位" :label-width="formLabelWidth">
									<el-input v-model="addEntrustForm.entrustCompany" autocomplete="off"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="公司地址" :label-width="formLabelWidth">
									<el-input v-model="addEntrustForm.adress" autocomplete="off"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
					
						<el-row :gutter="30">
							<el-col :span="12">
								<el-form-item label="电子邮箱" :label-width="formLabelWidth">
									<el-input v-model="addEntrustForm.email" autocomplete="off"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="公司座机" :label-width="formLabelWidth">
									<el-input v-model="addEntrustForm.phone" autocomplete="off"></el-input>
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
								  class="upload-demo"
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
				<!-- <el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button> -->
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'addEntrustDiglog', //新建业务委托 弹出框
		data() {
			return {
				dialogFormVisible: true,
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
	}
	
</style>
