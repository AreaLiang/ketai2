<template>
	<div class="mg-certificate">
		<!-- 主题内容顶部 -->
		<PageHeader :breadcrumbItem="$route.meta.headName">
			<el-button type="primary" @click="BatchDownload()">批量下载</el-button>
		</PageHeader>
		<div class="mg-certificate-box" v-loading="loading">
			<template>
				<el-table :data="tableData" @selection-change="handleSelectionChange" border style="width: 100%"
					:header-cell-style="{textAlign:'center'}"
					:cell-style="{textAlign:'center'}">
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="created" label="提交时间">
					</el-table-column>
					<el-table-column prop="reportNo" label="记录编号">
					</el-table-column>
					<el-table-column prop="subject.name" label="项目名称" width="120">
					</el-table-column>
					<el-table-column prop="checkTypeValue" label="鉴定类型" >
					</el-table-column>
				<!-- 	<el-table-column prop="subject.remark" label="备注">
					</el-table-column> -->
					<el-table-column prop="tableData" label="状态" width="80">
						<template slot-scope="scope">
							<div slot="reference" class="name-wrapper">
								<el-tag size="medium">
									{{ scope.row.status=="Completed"?"完成":"未完成" }}
								</el-tag>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="tableData" label="结果" width="80">
						<template slot-scope="scope">
							<div slot="reference" class="name-wrapper">
								<el-tag type="success" size="medium">
									{{ scope.row.passed?"合格":"不合格" }}
								</el-tag>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="100">
						<template slot-scope="scope">
							<el-button type="primary" @click="downLoadLertificate(scope.row)" size="small">下载</el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
			<div class="pagination-box">
				<!-- 分页功能 -->
				<Pagination :dataTotal="dataTotal" :pageSize="pageSize" />
			</div>
		</div>
	</div>
</template>

<script>
	import PageHeader from "@/components/PageHeader"
	import Pagination from "@/components/Pagination"
	import {mgCertificateApi} from "@/request/api"
	import {fileLinkToStreamDownload,BatchPdfDownload} from "@/utils"


	export default {
		name: 'mgCertificate', //证书管理
		data() {
			return {
				tableData: [],
				dataTotal: 0, //数据一共有多少条
				pageSize: 8, //每页显示多少条数据
				multipleSelection: [],
				loading: true,
				host:''//服务端的端口号
			}
		},
		methods: {
			//获取证书列表数据
			certificateData(page) {
				this.loading= true;
				mgCertificateApi({
					page: page,
					size: this.pageSize,
				}).then((data) => {
					console.log(data);
					if (data.code == "Ok") {
						let getData = data.data.content;
						this.host=data.url;//赋值端口号，用于证书管理下载链接的拼接
						console.log("getData", getData);
						this.tableData = JSON.parse(JSON.stringify(getData)); //初始化数据
						this.dataTotal = data.data.totalElements; //一共多少条数据
					}
					this.loading=false;
				}).catch(()=> this.loading=false);
			},
			//已经选中行的事件
			handleSelectionChange(val) {
				this.multipleSelection = val;
				
			},
			//批量下载事件
			BatchDownload(arr) {
				if(this.host){
					let selectionUrl = JSON.parse(JSON.stringify(this.multipleSelection));
					let urlList = [];//多个pdf文件链接的数组
					selectionUrl.forEach((p) => {
						urlList.push(this.host+p.reportFile);
					});
					if(urlList.length>0){//如果没有勾选多个文件
						//文件压缩打包
						BatchPdfDownload(urlList);
					}else{
						this.$message.warning("还没勾选要下载的证书文件");
					}
				}else throw new Error('http返回已经更改，检测this.host')
			},
			//下载事件
			downLoadLertificate(val) {
				if(this.host){
					let link=this.host+val.reportFile;
					//单个PDF文件下载事件
					fileLinkToStreamDownload(link, val.recordFile);
				}else throw new Error('http返回已经更改，检测this.host')
				
			},

		},
		components: {
			PageHeader,
			Pagination
		},
		mounted() {
			//初始化数据
			this.certificateData(0);
			//绑定分页点击事件
			this.$bus.$on('pageNumber', (page) => {
				this.certificateData(page);
			})
		},
		beforeDestroy() {
			this.$bus.$off('pageNumber'); // 解绑分页
		}
	}
</script>

<style scoped lang="less">
	.pagination-box {
		margin: 20px 0;
		text-align: right;
	}
</style>
