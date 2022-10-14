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

	export default {
		name: 'HomePage',
		data() {
			return {
				
			}
		},
		methods: {
			
		},
		components: {
			Sidebar,
			HomeHead,
		},
		mounted() {
			
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
		.pu_center;
		overflow: auto;
	}
	// .el-main{
	// 	padding:0;
	// }
</style>
