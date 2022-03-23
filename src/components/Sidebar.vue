<template>
	<div class="navigation">
		<el-row class="tac">
			<el-col :span="24" style="height: 100%;">
				<el-menu default-active="3" class="el-menu-vertical-demo" :router="true"  @open="handleOpen" @close="handleClose"
					background-color="#f3f3f3" text-color="black" active-text-color="#34b160" style="height:100%">
					<el-menu-item index="/Home">
						<i class="el-icon-edit-outline"></i>
						<span slot="title">业务委托</span>
					</el-menu-item>
					<el-menu-item index="/Home/1" disabled>
						<i class="el-icon-reading"></i>
						<span slot="title">证书管理</span>
					</el-menu-item>
					<el-menu-item index="/Home/userinfo">
						<i class="el-icon-user-solid"></i>
						<span slot="title">客户信息</span>
					</el-menu-item>
					<el-menu-item index="/Home/2">
						<i class="el-icon-check"></i>
						<span slot="title">密码更改</span>
					</el-menu-item>
					<el-menu-item index="/Home/3">
						<i class="el-icon-s-unfold"></i>
						<span slot="title">服务项目列表</span>
					</el-menu-item>
					<el-menu-item index="/Home/4">
						<i class="el-icon-download"></i>
						<span slot="title">业务委托表格下载</span>
					</el-menu-item>

					<div class="nav-info">
						<el-container>
							<el-header><i class="el-icon-postcard"></i>我们的服务宗旨</el-header>
							<el-main>高效，准确，公正，科学</el-main>
						</el-container>
					</div>
					<div class="nav-info">
						<el-container>
							<el-header class="warncolor">您的信息尚未被认证</el-header>
							<el-main class="yellow">请完善客户信息，上传真实的营业执照和安全证照照片，等待工作人员完成对您的真实身份认证。</el-main>
						</el-container>
					</div>
				</el-menu>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	export default {
		name: 'Sidebar',
		data() {
			return {

			}
		},
		methods: {
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			}
		},
		conponents: {

		}
	}
</script>

<style lang="less">
	@navHight: 100%;

	.warnClass(@bg_color, @text_color: white) {
		background-color: @bg_color;
		margin: 5px 10px;
		color: @text_color;
	}

	.navigation {
		height: @navHight;

		.el-row,
		.el-menu {
			height: @navHight;
		}
	}

	.nav-info {
		margin: 30px 0;

		.el-header {
			height: 30px !important;
			line-height: 30px;
		}

		.el-container.is-vertical {
			background: white;
		}

		.warncolor {
			.warnClass(orange)
		}

		.yellow {
			.warnClass(#ffff99, black)
		}

		i {
			margin-right: 5px;
			width: 24px;
			text-align: center;
			font-size: 18px;
		}
	}
</style>
