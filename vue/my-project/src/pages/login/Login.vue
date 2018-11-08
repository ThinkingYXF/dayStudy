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
				<el-form-item label="年龄" prop="age">
					<el-input v-model.number="registerForm.age"></el-input>
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
				<el-form-item label="手机号" prop="loginPhone">
					<el-input type="text" v-model="loginForm.loginPhone" auto-complete="off"></el-input>
				</el-form-item>
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
			var checkAge = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('年龄不能为空'));
				}
				setTimeout(() => {
					if (!Number.isInteger(value)) {
						callback(new Error('请输入数字值'));
					} else {
						if (value < 18) {
							callback(new Error('必须年满18岁'));
						} else {
							callback();
						}
					}
				}, 1000);
			};
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					if (this.registerForm.checkPass !== '') {
						this.$refs.registerForm.validateField('checkPass');
					}
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
			var validateName = (rule, value, callback) => {
				if(value === '')
					callback(new Error('请输入昵称'));
				else
					callback();
			}
			var validatePhone = (rule, value, callback) => {
				var reg = /^\d{11}$/;
				if(value === '')
					callback(new Error('请输入手机号'));
				else if(!reg.test(value))
					callback(new Error('手机号格式错误'));
				else
					callback();
			}
			return {
				registerForm: {
					name: '',
					phone: '',
					pass: '',
					checkPass: '',
					age: ''
				},
				loginForm: {
					loginName: '',
					loginPhone: '',
					loginPass: ''
				},
				rules: {
					name: [{validator: validateName, trigger:'blur'}],
					phone: [{validator: validatePhone, trigger: 'blur'}],
					pass: [{ validator: validatePass, trigger: 'blur' }],
					checkPass: [{ validator: validatePass2, trigger: 'blur' }],
					age: [{ validator: checkAge, trigger: 'blur' }]
				},
				rules1: {
					loginName: [{validator: validateName, trigger:'blur'}],
					loginPhone: [{validator: validatePhone, trigger: 'blur'}],
					loginPass: [{ validator: validatePass, trigger: 'blur' }],
				},
				isAccount: false
			};
		},
		methods: {
			register(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						axios.post('http://localhost:8099/register', {name: 123, phone: 111}, function(){
							this.$message({
								message: '注册成功',
								type: 'success'
							});
						})
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
						pass: this.loginForm.loginPass,
						phone: this.loginForm.loginPhone
					}
					ajaxRequest.login.save(loginData, function(){

					});
					if (valid) {
						this.$message({
							message: '登录成功',
							type: 'success'
						});
						// setTimeout(function(){
						// 	window.location.hash = '/modules';
						// },1000);
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
	.el-form-item{
		margin: 22px 40px 0 0;
	}
	.wrapper h2 {
		text-align: center;
		color: skyblue;
	}
</style>

