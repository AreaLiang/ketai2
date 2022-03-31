<template>
	<div class="mg-certificate">
		<!-- 主题内容顶部 -->
		<PageHeader :breadcrumbItem="$route.meta.headName" />
		
		<div class="mg-certificate-box">
			<template>
				<el-table :data="tableData" border style="width: 100%" :header-cell-style="{textAlign:'center'}"
					:cell-style="{textAlign:'center'}">
					<el-table-column prop="date" label="提交时间">
					</el-table-column>
					<el-table-column prop="name" label="联系人" width="120">
					</el-table-column>
					<el-table-column prop="province" label="联系人手机号">
					</el-table-column>
					<el-table-column prop="city" label="备注">
					</el-table-column>
					<el-table-column prop="status" label="状态" width="80">
						<template slot-scope="scope">
							<div slot="reference" class="name-wrapper">
								<el-tag :type="scope.row.statusBtnStyle" size="medium">{{ scope.row.status }}</el-tag>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="zip" label="	受理业务员" width="120">
					</el-table-column>
					<el-table-column label="操作" width="300">
						<template slot-scope="scope">
							<!-- <el-button @click="handleClick(scope.row)" type="primary" size="small">查看</el-button>
							 -->
							<el-button type="primary" v-if="scope.row.opBtnList.orderEditBtn" size="small">委托单编辑</el-button>
							<el-button type="primary" v-if="scope.row.opBtnList.entrustFileBtn" size="small">委托文件</el-button>
							<el-button type="primary" v-if="scope.row.opBtnList.paymentShowBtn" size="small">支付证明</el-button>
							<el-button type="primary" v-if="scope.row.opBtnList.downCertBtn" size="small">下载证书</el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
			<div class="pagination-box">
				<!-- 分页功能 -->
				<Pagination :dataTotal="dataTotal" :pageSize="2"/>
			</div>
		</div>
	</div>
</template>

<script>
	import PageHeader from "@/components/PageHeader"
	import Pagination from "@/components/Pagination"
	export default {
		name: 'mgCertificate', //证书管理
		data() {
			return {
				tableData:[],
				dataTotal:0,
			}
		},
		components: {
			PageHeader,
			Pagination
		}
	}
</script>

<style scoped lang="less">
.pagination-box{
	margin:20px 0;
	text-align: right;
}
</style>
