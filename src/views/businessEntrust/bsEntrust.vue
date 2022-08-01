<template>
	<div class="businessEntrust" v-loading="loading">
		<!-- 主题内容顶部 -->
		<PageHeader :breadcrumbItem="$route.meta.headName">
			<el-button type="primary" @click="addEntrust()">新建业务委托</el-button>
		</PageHeader>
		<div class="entrust-manage">
			<template>
				<el-table :data="tableData" border style="width: 100%" :header-cell-style="{textAlign:'center'}"
					:cell-style="{textAlign:'center'}">
					<el-table-column prop="created" label="提交时间" width="180">
					</el-table-column>
					<el-table-column prop="contact" label="联系人" width="120">
					</el-table-column>
					<el-table-column prop="mobile" label="联系人手机号">
					</el-table-column>
					<el-table-column prop="remark" label="备注">
					</el-table-column>
					<el-table-column prop="statusCn" label="状态" width="100">
						<template slot-scope="scope">
							<div slot="reference" class="name-wrapper">
								<el-tooltip class="item" effect="dark" :content="scope.row.rawData.reason" :disabled="statusMeg(scope.row)" placement="top-start">
								    <el-tag :type="scope.row.statusBtnColor" :effect="scope.row.statusBtnStyle"
								      	size="medium">{{ scope.row.statusCn }}</el-tag>
								</el-tooltip>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="receiver" label="受理业务员" width="120">
					</el-table-column>
					<el-table-column label="操作" width="350">
						<template slot-scope="scope">
							<el-button type="primary" v-if="scope.row.opBtnList.orderEditBtn" size="small"
								@click="modifyEntrust(scope.row)">
								<i class="el-icon-edit-outline"></i>
								委托单编辑
							</el-button>

							<el-button type="primary" v-if="scope.row.opBtnList.entrustFileBtn" size="small"
								@click="openDialog('entrustFileDialog',scope.row)">委托文件
							</el-button>

							<el-button type="primary" v-if="scope.row.opBtnList.acceptanceListBtn" size="small"
								@click="openDialog('acceptanceDialog',scope.row)">
								{{scope.row.rawData.checkFile ? "完工验收单" : "上传验收单"}}
							</el-button>

							<el-button type="primary" v-if="scope.row.opBtnList.paymentProveBtn"
								@click="openDialog('paymentProveDialog',scope.row)" size="small">
								{{scope.row.rawData.payFile ? "支付证明" : "上传支付证明"}}
							</el-button>

							<el-button type="primary" v-if="scope.row.opBtnList.downCertBtn" size="small"
								@click="DownloadCertificate()">下载证书
							</el-button>

							<el-button type="primary" v-if="scope.row.opBtnList.resubmitBtn" @click="submitAgain(scope.row)" size="small">重新提交
							</el-button>

						</template>
					</el-table-column>
				</el-table>
			</template>
			<div class="pagination-box">
				<!-- 分页功能 -->
				<Pagination :dataTotal="dataTotal" :pageSize="pageSize"  :currentPage="currentPage"/>
			</div>
		</div>

		<!-- 新建业务委托 弹出框 -->
		<addEntrustDiglog ref="addEntrustDiglog"  @subEntrust='subAddEntrust' />
		
		<!-- 委托单编辑 弹出框 -->
		<editEntrustDiglog ref="editEntrustDiglog" @subEntrust='subModifyEntrust' :isCreatedOrder="true"/>

		<!-- 委托文件查看 弹出框 -->
		<entrustFileDialog ref="entrustFileDialog"/>

		<!-- 上传验收单/完工验收单 弹出框 -->
		<acceptanceDialog ref="acceptanceDialog" :currentPage="currentPage" />

		<!-- 支付证明/上传支付证明 弹出框 -->
		<paymentProveDialog ref="paymentProveDialog" :currentPage="currentPage" />

	</div>
</template>

<script>
	import PageHeader from "@/components/PageHeader"
	import Pagination from "@/components/Pagination"
	import addEntrustDiglog from "./components/bsEntrustmentDiglog"
	import editEntrustDiglog from "./components/bsEntrustmentDiglog"
	import entrustFileDialog from "./components/entrustFileDialog"
	import acceptanceDialog from "./components/acceptanceDialog"
	import paymentProveDialog from "./components/paymentProveDialog"

	import {bsEntrustmentApi,modifyEntrustOrderApi,addEntrustOrderApi} from "@/request/api"
	import {timestamp,throttle} from '@/utils'
	import {cgBsEntrustData,entrustObj} from '@/utils/bsEntrust'
	import NProgress from 'nprogress' // 引入头部进度条

	export default {
		name: 'bsEntrust', //业务委托
		data() {
			return {
				tableData: [],
				dataTotal: 0, //数据一共有多少条
				pageSize: 8, //每页显示多少条数据
				loading: true,
				currentPage:1
			}
		},
		computed: {
			statusMeg(){//状态框，指针指中时候提示信息，如果有则显示
				return (currentRow)=> {
					return currentRow.rawData.reason ? false:true
				}
			}
		},
		components: {
			PageHeader,
			Pagination,
			addEntrustDiglog,
			entrustFileDialog,
			acceptanceDialog,
			paymentProveDialog,
			editEntrustDiglog
		},
		methods: {
			/* 打开弹出层 
			 *** 第一个参数为该弹出层组件的ref 名字，字符串传入,
			 *** 第二个是表格每行的参数 默认scope.row 
			 * */
			openDialog(dialogName, row) {
				this.$refs[dialogName].dialogFormVisible = true;
				this.$bus.$emit('currentRowData', row); //赋值所点击的行 数据
			},
			//新建业务委托
			addEntrust() {
				let dialog = this.$refs.addEntrustDiglog;
				dialog.dialogFormVisible = true;
			},
			//提交 新建业务委托
			subAddEntrust(res){
				let {obj,postData}=res;
				
				const addEntrustOrder=()=>{
					addEntrustOrderApi(postData).then((data) => {
						obj.afterSubmit(data, "新建成功", "新建失败");
					}).finally(()=>{this.loading=false});
				}
				throttle(addEntrustOrder,3000)//节流函数
			},
			//打开 委托单编辑
			modifyEntrust(data) {
				let dialog = this.$refs.editEntrustDiglog;
				dialog.dialogFormVisible = true;
				dialog.rowData = data;
			},
			//提交 委托单编辑
			subModifyEntrust(res){
				let {obj,postData}=res;
				postData.id = obj.rowData.rawData.id;
				console.log("postdata:",postData)
				
				const modifyEntrustOrder=()=>{
					modifyEntrustOrderApi(postData).then((data) => {
						console.log("成功返回",data)
						obj.afterSubmit(data, "修改成功", "修改失败");
					}).finally(()=>{obj.loading=false});
				}
				throttle(modifyEntrustOrder,3000)//节流函数
			},
			//重新提交委托单
			submitAgain(currentRow){
				let data=JSON.parse(JSON.stringify(currentRow));
				
				let postData=new entrustObj(data);//委托单需要的信息
				postData.id=data.rawData.id;//添加id的属性
				console.log("postData,2",postData)
				modifyEntrustOrderApi(postData).then((data) => {
					if (data.code == "20000") {
						this.$message.success("提交成功");
						this.$bus.$emit('pageNumber', 1);
					} else {
						this.$message.error("提交失败");
					}
				});
			},
			//页码点击事件,page 是页码， pageSize 是每页显示多少条数据
			PaginationClick(page, pageSize) {
				this.loading=true;
				NProgress.start() //开启进度条
				bsEntrustmentApi({
					page: page,
					pageSize: pageSize
				}).then((res) => {
					let data = res.data;
					if (res.code == "20000") {
						this.dataTotal = data.totalElements;
					}
					this.tableData = cgBsEntrustData(data); //赋值数据渲染
					NProgress.done(); //结束进度条
					this.loading=false;
				}).catch(()=> this.loading=false);
			},
			//点击下载证书事件
			DownloadCertificate() {
				this.$router.push('/Home/mgCertificate');
			}
		},
		mounted() {
			this.PaginationClick(0, this.pageSize); //进来默认渲染第一页，后端数据第一页的页码为 0
			//绑定事件，页码发生改变时候重新发送请求显示数据
			this.$bus.$on('pageNumber', (page = 1) => {
				this.currentPage=page;//保存当前页码，用于某些交换后刷新当页
				this.PaginationClick(page - 1, this.pageSize);
			})
		},
		beforeDestroy() {
			this.$bus.$off('currentRowData');// 解绑
			this.$bus.$off('pageNumber');// 解绑分页
		}
	}
</script>

<style scoped lang="less">
	.pagination-box {
		margin: 20px 0;
		text-align: right;
	}

	.entrust-manage {
		margin-top: 20px;
	}
</style>
