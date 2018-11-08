<template>
	<el-container>
		<!-- header部分 -->
		<el-header>
			<div class="iconDiv" @click="returnHome">主页</div>

			<ul class="header_nav">
				<li><el-button icon="el-icon-edit"></el-button></li>
				<li><el-button icon="el-icon-share"></el-button></li>
				<li><el-button icon="el-icon-search"></el-button></li>
				<li><el-button icon="el-icon-close"></el-button></li>
				<li>
					<div class="avatar">
						<img src="../../assets/user.jpg" alt="">
					</div>
					<div class="user">
						<span>Welcome</span>
						<span>Just For Fun</span>
					</div>
				</li>
			</ul>
		</el-header>
		<!-- header部分 -->

		<el-container>
			<!-- 左侧菜单栏 -->
			<el-aside>
				<el-menu default-active="1-1" class="el-menu-vertical-demo" 
				@open="handleOpen" @close="handleClose"
				background-color="#545c64"
				text-color="#fff"
				active-text-color="#ffd04b">
					<el-submenu index="1">
						<template slot="title">
							<i class="el-icon-location"></i>
							<span slot="title">导航一</span>
						</template>
						<el-menu-item-group>
							<!-- <span slot="title">分组一</span> -->
							<el-menu-item index="1-1">
								<router-link to="/modules/first">选项1</router-link>
							</el-menu-item>
							<el-menu-item index="1-2">
								<router-link to="/modules/test">选项2</router-link>
								<!-- 选项2 -->
							</el-menu-item>
						</el-menu-item-group>
						<el-submenu index="1-3">
							<span slot="title">选项3</span>
							<el-menu-item index="1-3-1">选项1</el-menu-item>
						</el-submenu>
					</el-submenu>
					<el-menu-item index="2">
						<i class="el-icon-menu"></i>
						<span slot="title">导航二</span>
					</el-menu-item>
					<el-menu-item index="3" disabled>
						<i class="el-icon-document"></i>
						<span slot="title">导航三</span>
					</el-menu-item>
					<el-menu-item index="4">
						<i class="el-icon-setting"></i>
						<span slot="title">导航四</span>
					</el-menu-item>
				</el-menu>
			</el-aside>
			<!-- 左侧菜单栏 -->

			<!-- 右侧内容 路由 -->
			<el-main>
				<!-- <h1>hello world</h1> -->
				<router-view></router-view>
			</el-main>
			<!-- 右侧内容 路由 -->
		</el-container>
		
	</el-container>
</template>
<script>
window.onload = function(){
	function resize(){
		var demo = document.getElementsByClassName('el-menu-vertical-demo'),
			main = document.getElementsByClassName('el-main');
		if(demo.length && main.length){
			demo[0].style.minHeight = (window.innerHeight - 60) + 'px';
			main[0].style.maxHeight = (window.innerHeight - 60) + 'px';
		}
	}
	resize();
	window.onresize = function(){
		resize();
	}
}
export default {
	// data() {
		
    // },
    methods: {
		handleOpen(key, keyPath) {
			console.log(key, keyPath);
		},
		handleClose(key, keyPath) {
			console.log(key, keyPath);
		},
		returnHome(){
			window.location.hash = '/modules';
		}
    }
};
</script>

<style scoped>
	.header_nav{
		float: right;
		margin-right: 50px;
		margin-top: 10px;
	}
	.header_nav > li{
		float: left;
	}
	.header_nav > li button{
		color: #ccc;
		background: #2F4056;
		border: #2F4056;
	}
	.header_nav > li button:hover{
		color: #fff;
	}
	.header_nav > li .avatar{
		float: left;
		margin-left: 30px;
	}
	.header_nav > li .avatar > img{
		width: 34px;
		height: 34px;
		border-radius: 50%;
	}
	.header_nav > li .user{
		display: inline-block;
	}
	.header_nav > li .user > span{
		display: block;
		font-size: 12px;
		margin-top: 3px;
		margin-left: 15px;
	}
	.el-header{
		color: #fff;
		padding: 0;
		background: #2F4056;
		/* background: #393D49; */
	}
	.iconDiv{
		float: left;
		/* background: #2F4056; */
		background: #393D49;
		text-align: center;
		width: 200px;
		line-height: 60px;
		font-size: 25px;
		cursor: pointer;
	}
	.el-menu-vertical-demo{
		width: 200px;
  	}
	.el-aside{
		width: 201px !important;
	}
	.el-menu-vertical-demo li > a{
		color: #fff;
		text-decoration: none;
		display: inline-block;
		width: 100%;
	}
	li.el-menu-item.is-active > a{
		color: rgb(255, 208, 75)
	}
</style>

