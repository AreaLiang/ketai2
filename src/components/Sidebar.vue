<<<<<<< HEAD
<template>
	<div class="navigation">
		<el-row class="tac">
			<el-col :span="24" style="height: 100%;">
				<el-menu default-active="3" class="el-menu-vertical" @select="handleindex" :router="true"
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
					<el-menu-item index="/Home/password"
						:route="{ path: '/Home/password', query: { name: '/Home/password' } }">
						<i class="el-icon-check"></i>
						<span slot="title">密码更改</span>
					</el-menu-item>
					<el-menu-item index="/Home/pdfView">
						<i class="el-icon-s-unfold"></i>
						<span slot="title">服务项目列表</span>
					</el-menu-item>
					<el-menu-item index="/Home/businessEntrust">
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
			//获取用户所点击的导航地址
			handleindex(key, keyPath) {
				this.$bus.$emit('isPageHeader', key)
			},
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
=======
<template>
	<div class="navigation">
		<el-row class="tac">
			<el-col :span="24" style="height: 100%;">
				<el-menu :default-active="currentUrl" class="el-menu-vertical" @select="handleindex" :router="true"
					background-color="#f3f3f3" text-color="black" active-text-color="#34b160" style="height:100%">
					<!-- 循环遍历导航 -->
					<el-menu-item v-for="(p,index) in navList" :index="p.address" :key="index">
						<i :class="p.icon"></i>
						<span slot="title">{{p.name}}</span>
					</el-menu-item>
					
					<!-- 专属业务经理 -->
					<div class="nav-info dedicated-manager-info" v-if="businessManager">
						<el-container>
							<el-header><i class="el-icon-postcard"></i>专属业务经理信息</el-header>
							<el-main>
								<p :title="businessManager.name">姓名：{{businessManager.name}}</p>
								<p :title="businessManager.mobile">手机：{{businessManager.mobile}}</p>
								<p :title="businessManager.email">邮箱：{{businessManager.email}}</p>
							</el-main>
						</el-container>
					</div>
					
					<!-- 服务宗旨 -->
					<div class="nav-info service-purposes">
						<el-container>
							<el-header><i class="el-icon-postcard"></i>我们的服务宗旨</el-header>
							<el-main>高效，准确，公正，科学</el-main>
						</el-container>
					</div>
					
					<!-- 认证警告信息 -->
					<div class="nav-info" v-if="infoWarning">
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
	import {mapGetters,mapState} from 'vuex'
	export default {
		name: 'Sidebar',
		data() {
			return {
				navList: [{
					name: '业务委托', //导航名称
					icon: 'el-icon-edit-outline', //导航图标
					address: '/Home/businessEntrust', //导航地址
					isAuthorize: true
				}, {
					name: '证书管理',
					icon: 'el-icon-reading',
					address: '/Home/mgCertificate',
					isAuthorize: true
				}, {
					name: '客户信息',
					icon: 'el-icon-user-solid',
					address: '/Home/userinfo',
					isAuthorize: false
				}, {
					name: '密码更改',
					icon: 'el-icon-check',
					address: '/Home/password',
					isAuthorize: false
				}, {
					name: '服务项目列表',
					icon: 'el-icon-s-unfold',
					address: '/Home/serviceList',
					isAuthorize: false
				}, {
					name: '客户注册指引',
					icon: 'el-icon-s-promotion',
					address: '/Home/customerGuidelines',
					isAuthorize: true
				}],
				infoWarning: false ,//未认证警告提示
				currentUrl:""
			}
		},
		watch:{
			$route(to,from) {//监听导航变化，更改选中导航的链接
				this.currentUrl=to.path;
			}
		},
		computed: {
			...mapGetters(["isCertification"]),//获取身份信息
			...mapState({
				businessManager:state=> state.userInfo.businessManager
			})
		},
		methods: {
			//获取用户所点击的导航地址
			handleindex(key, keyPath) {
				this.$bus.$emit('isPageHeader', key);
			}
		},
		mounted() {
			//当前导航的地址
			this.currentUrl=this.$router.history.current.fullPath;
			
			//导航权限控制，如果客户状态不是正常 ，不显示全部导航 
			if (this.isCertification != "正常") {
				this.navList = this.navList.filter((p) => {
					return !p.isAuthorize
				});
			}
			
			//如果客户状态是未认证
			if(this.isCertification=="未认证"){
				this.infoWarning = true; //未认证警告提示
			}
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

		.service-purposes {
			border: 1px solid #dddddd;
		}

		.el-menu-item {
			border-bottom: 1px solid #dddddd;
		}
		
		.dedicated-manager-info{
			p{
				margin: 5px 0;
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.el-header{
				border-top: 1px solid #f1ab07;
			}
		}
		.el-main{
			padding: 10px 15px;
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
>>>>>>> main
</style>
