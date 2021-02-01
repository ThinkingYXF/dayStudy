<template>
	<div class="wrapper">
		<div class="register" v-if="isAccount">
			<h2>注册</h2>
			<el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="昵称" prop="name">
					<el-input type="text" v-model="registerForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="phone">
					<el-input type="text" v-model="registerForm.phone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="pass">
					<el-input type="password" v-model="registerForm.pass" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPass">
					<el-input type="password" v-model="registerForm.checkPass" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input type="text" v-model="registerForm.email"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="register('registerForm')">注册 </el-button>
					 已有账号? <el-button type="text" @click="showLogin('registerForm')">登录</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="login" v-if="!isAccount">
			<h2>登录</h2>
			<el-form :model="loginForm" status-icon :rules="rules1" ref="loginForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="昵称" prop="loginName">
					<el-input type="text" v-model="loginForm.loginName" auto-complete="off"></el-input>
				</el-form-item>
				<!-- <el-form-item label="手机号" prop="loginPhone">
					<el-input type="text" v-model="loginForm.loginPhone" auto-complete="off"></el-input>
				</el-form-item> -->
				<el-form-item label="密码" prop="loginPass">
					<el-input type="password" v-model="loginForm.loginPass" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="login('loginForm')">登录 </el-button>
					 没有账号? <el-button type="text" @click="showRegister('loginForm')">注册</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script>
	import axios from 'axios';
	import { ajaxRequest } from '../../request.js';
	export default {
		data() {
			var validateName = (rule, value, callback) => {
				if(value === '')
					callback(new Error('请输入昵称'));
				//校验名称是否存在
				else if(rule.field === 'loginName'){
					ajaxRequest.searchUser.save({
						name: value
					}, function(res){
						res = res.data;
						if(res.success && res.data && res.data.length){
							callback();
						}else{
							callback(new Error('昵称不存在'));
						}
					});
				}
				//注册时的校验 名称是否重复
				else{
					ajaxRequest.searchUser.save({
						name: value
					}, function(res){
						res = res.data;
						if(res.success && res.data && res.data.length){
							callback(new Error('昵称已存在'));
						}else{
							callback();
						}
					});
				}
			}
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					// if (this.registerForm.checkPass !== '') {
					// 	this.$refs.registerForm.validateField('checkPass');
					// }
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.registerForm.pass) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			var validatePhone = (rule, value, callback) => {
				var reg = /^\d{11}$/;
				if(!reg.test(value) && value)
					callback(new Error('手机号格式错误'));
				else
					callback();
			}
			var validateEmail = (rule, value, callback) => {
				var reg = /^([0-9a-zA-Z_\-\.])+\@([0-9a-zA-Z_\-\.])+\.([a-zA-Z])+$/;
				if(!reg.test(value) && value)
					callback(new Error('邮箱格式错误'));
				else
					callback();
			};
			return {
				registerForm: {
					name: '',
					phone: '',
					pass: '',
					checkPass: '',
					email: ''
				},
				loginForm: {
					loginName: '',
					// loginPhone: '',
					loginPass: ''
				},
				rules1: {
					loginName: [{validator: validateName, trigger:'blur'}],
					// loginPhone: [{validator: validatePhone, trigger: 'blur'}],
					loginPass: [{ validator: validatePass, trigger: 'blur' }],
				},
				rules: {
					name: [{validator: validateName, trigger:'blur'}],
					phone: [{validator: validatePhone, trigger: 'blur'}],
					pass: [{ validator: validatePass, trigger: 'blur' }],
					checkPass: [{ validator: validatePass2, trigger: 'blur' }],
					email: [{ validator: validateEmail, trigger: 'blur' }]
				},
				isAccount: false
			};
		},
		methods: {
			register(formName) {
				this.$refs[formName].validate((valid) => {
					var registerData = {
						name: this.registerForm.name,
						password: this.registerForm.pass,
						phone: this.registerForm.phone,
						checkPass: this.registerForm.checkPass,
						email: this.registerForm.email
					}
					if (valid) {
						var that = this;
						ajaxRequest.register.save(registerData, function(res){
							res = res.data;
							if(!res.message && res.success){
								that.$message({
									message: '注册成功',
									type: 'success'
								});
								setTimeout(function(){
									that.isAccount = false;
									that.$refs[formName].resetFields();
								}, 1000);
							}else{
								that.$message({
									message: res.message,
									type: 'warning'
								});
							}
						});
					} else {
						this.$message({
							message: '信息填写错误,请确认',
							type: 'warning'
						});
						return false;
					}
				});
			},
			login(formName) {
				this.$refs[formName].validate((valid) => {
					var loginData = {
						name: this.loginForm.loginName,
						password: this.loginForm.loginPass,
						// phone: this.loginForm.loginPhone
					}
					if (valid) {
						var that = this;
						ajaxRequest.login.save(loginData, function(res){
							res = res.data;
							if(res.success && !res.message){
								that.$message({
									message: '登录成功',
									type: 'success'
								});
								setTimeout(function(){
									window.location.hash = '/modules';
								},1000);
							}else{
								that.$message({
									message: res.message,
									type: 'warning'
								});
							}
						});
						
					} else {
						this.$message({
							message: '信息填写错误,请确认',
							type: 'warning'
						});
						return false;
					}
				});
			},
			showLogin(formName) {
				this.isAccount = false;
				this.$refs[formName].resetFields();
			},
			showRegister(formName) {
				this.isAccount = true;
				this.$refs[formName].resetFields();
			}
		}
	}
</script>

<style scoped>
	.wrapper{
		margin-top: 20px;
	}
	.el-form-item{
		margin: 22px 40px 0 0;
	}
	.wrapper h2 {
		text-align: center;
		color: skyblue;
	}
</style>

