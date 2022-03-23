<template>
	<div class="wscn-http404-container">
		<div class="wscn-http404">
			<el-col :span="12">
				<div class="pic-404">
					<img class="pic-404__parent" src="@/assets/404_images/404.png" alt="404">
				</div>
			</el-col>
			<el-col :span="12">
				<div class="bullshit">
					<div><span style="color: #0086B3;font-size: 25px;">OOPS</span></div>
					<div><span>版权所有:广东数智信息科技有限公司</span></div>
					<div><span style="color: #000000;">网管说这个页面你不能进</span></div>
					<div><span style="font-size: 15px;">请检查你输入的网址是否正确，找不到请求的网络资源</span></div>
				</div>
			</el-col>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'error404',
		data() {
			return {

			}
		},
	}
</script>
<style lang="less" scoped>
	@import '@/less/common';
	.wscn-http404-container{
		height: 100%;
	}
	.pic-404 {
		width: 500px;
		height: 350px;

		.pic-404__parent {
			height: 100%;
			width: 100%;
		}
	}

	.wscn-http404 {
		overflow: hidden;
		.pu_center
	}

	.bullshit {
		color: #909399;
		padding: 20px;
		font-size: 20px;
		font-weight: bold;
		div{
			margin: 20px 0;
		}
	}
</style>
