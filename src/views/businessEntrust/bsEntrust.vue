<template>
	<div class="businessEntrust">
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
					<el-table-column prop="statusCn" label="状态" width="80">
						<template slot-scope="scope">
							<div slot="reference" class="name-wrapper">
								<el-tag :type="scope.row.statusBtnColor" :effect="scope.row.statusBtnStyle"
									size="medium">{{ scope.row.statusCn }}</el-tag>
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

							<el-button type="primary" v-if="scope.row.opBtnList.resubmitBtn" size="small">重新提交
							</el-button>

						</template>
					</el-table-column>
				</el-table>
			</template>
			<div class="pagination-box">
				<!-- 分页功能 -->
				<Pagination :dataTotal="dataTotal" :pageSize="pageSize" />
			</div>
		</div>

		<!-- 新建业务委托 弹出框 -->
		<addEntrustDiglog ref="addEntrustDiglog" />

		<!-- 委托文件查看 弹出框 -->
		<entrustFileDialog ref="entrustFileDialog" />

		<!-- 上传验收单/完工验收单 弹出框 -->
		<acceptanceDialog ref="acceptanceDialog" />

		<!-- 支付证明/上传支付证明 弹出框 -->
		<paymentProveDialog ref="paymentProveDialog" />

	</div>
</template>

<script>
	import PageHeader from "@/components/PageHeader"
	import Pagination from "@/components/Pagination"
	import addEntrustDiglog from "./components/addEntrustDiglog"
	import entrustFileDialog from "./components/entrustFileDialog"
	import acceptanceDialog from "./components/acceptanceDialog"
	import paymentProveDialog from "./components/paymentProveDialog"

	import {
		bsEntrustmentApi
	} from "@/request/api"
	import {
		timestamp
	} from '@/utils'
	import {
		cgBsEntrustData
	} from '@/utils/bsEntrust'
	import NProgress from 'nprogress' // 引入头部进度条

	export default {
		name: 'bsEntrust', //业务委托
		data() {
			return {
				tableData: [],
				dataTotal: 0, //数据一共有多少条
				pageSize: 8, //每页显示多少条数据
			}
		},
		components: {
			PageHeader,
			Pagination,
			addEntrustDiglog,
			entrustFileDialog,
			acceptanceDialog,
			paymentProveDialog
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
				dialog.operateType = 1;
			},
			modifyEntrust(data) {
				let dialog = this.$refs.addEntrustDiglog;
				dialog.dialogFormVisible = true;
				dialog.operateType = 0;
				dialog.rowData = data;
			},
			//页码点击事件,page 是页码， pageSize 是每页显示多少条数据
			PaginationClick(page, pageSize) {
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
					// console.log("业务委托：",data)
				});
			},
			DownloadCertificate() {
				this.$router.push('/Home/mgCertificate');
			}
			// cellStyle(row, column, rowIndex, columnIndex) {
			// 	console.log("66")
			// }
		},
		mounted() {
			this.PaginationClick(0, this.pageSize); //进来默认渲染第一页，后端数据第一页的页码为 0
			//绑定事件，页码发生改变时候重新发送请求显示数据
			this.$bus.$on('pageNumber', (page) => {
				this.PaginationClick(page - 1, this.pageSize);
			})
		},
		beforeDestroy() {
			this.$bus.$off('currentRowData');
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
