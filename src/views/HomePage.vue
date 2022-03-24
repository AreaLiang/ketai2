<template>
	<div class="home">
		<div class="home-box">
			<el-container style="height: 100%;">
				<el-header style="padding: 0;" height="70">
					<HomeHead />
				</el-header>
				<el-container>
					<el-aside width="260px">
						<!-- 导航栏 -->
						<Sidebar />
					</el-aside>
					<el-main>
						<!-- 主题内容顶部 -->
						<PageHeader v-show="showPageHeader"/>
						<router-view></router-view>
					</el-main>
				</el-container>
			</el-container>
		</div>
	</div>
</template>

<script>
	import Sidebar from '@/components/Sidebar'
	import HomeHead from '@/components/HomeHead'
	import PageHeader from '@/components/PageHeader'

	export default {
		name: 'HomePage',
		data() {
			return {
				showPageHeader: true,
			}
		},
		methods: {
			
		},
		components: {
			Sidebar,
			HomeHead,
			PageHeader
		},
		mounted() {
			//控制头部显示，如果是服务项目列表，则不显示
			this.$bus.$on('isPageHeader',(path)=>{
				if(path=="/Home/pdfView"){
					 this.showPageHeader=false
				}else{
					this.showPageHeader=true
				}
			});
			
		}
	}
</script>

<style scoped lang="less">
	@import '@/less/common';

	.home {
		min-width: 1200px;
		min-height: 850px;
		.pu_bgimg;
	}

	.home-box {
		width: 90%;
		height: 95%;
		background-color: white;
		.pu_center
	}
</style>
