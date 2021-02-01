<template>
    <div class="demo-block demo-box demo-zh-CN demo-layout">
        <!-- 每行分24块 -->
        <el-row>
            <el-col :span="12">
                <!-- 图标 -->
                <i class="el-icon-delete"></i>
                <el-button type="primary" icon="el-icon-search">搜索</el-button>
            </el-col>
            <el-col :span="12">
                <!-- 按钮 -->
                <el-button type="success">成功按钮</el-button>
                <el-button type="success" plain>成功按钮</el-button>
                <el-button type="success" round>成功按钮</el-button>
                <el-button type="success" icon="el-icon-check" circle></el-button>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="12">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                </el-checkbox-group>
            </el-col>

            <el-col :span="12">
                <!-- 类似搜索引擎的select -->
                <el-select
                    v-model="value9"
                    multiple
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="remoteMethod"
                    :loading="loading">
                    <el-option
                    v-for="item in options4"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>

        <el-row>
            <!-- Cascader 级联选择器 -->
            <el-col :span="12">
                <el-cascader
                    :options="options"
                    v-model="selectedOptions"
                    @change="handleChange">
                </el-cascader>
            </el-col>

            <el-col :span="12">
                <!-- enctype="multipart/form-data" -->
                <el-form target="myIframe" method="post"
                action="http://localhost:8888/abc" :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="姓名" prop="name">
                        <el-input type="text" name="name" v-model="ruleForm2.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="年龄" prop="age">
                        <el-input v-model.number="ruleForm2.age" name="age"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="头像" prop="icon">
                        <el-input type="file" name="icon"></el-input>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button native-type="submit" @click="submitForm('ruleForm2')">提交</el-button>
                        <el-button @click="resetForm('ruleForm2')">重置</el-button>
                    </el-form-item>
                </el-form>
                <iframe style="display: none" src="" frameborder="0" name="myIframe"></iframe>
            </el-col>
        </el-row>
        
    </div>
</template>
<style scope>
    .el-row{
        margin: 15px 0;
    }
</style>


<script>
    import { ajaxRequest } from '../../request.js';
    const cityOptions = ['上海', '北京', '广州', '深圳'];
    export default{
        data(){
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
            var validateName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入姓名'));
                }else
                    callback();
            };
            return {
                checkAll: false,
                checkedCities: ['上海', '北京'],
                cities: cityOptions,
                isIndeterminate: true,

                options4: [],
                value9: [],
                list: [],
                loading: false,

                options: [],
                selectedOptions: [],
                selectedOptions2: [],


                ruleForm2: {
                    name: '',
                    age: ''
                },
                rules2: {
                    name: [
                        { validator: validateName, trigger: 'blur' }
                    ],
                    age: [
                        { validator: checkAge, trigger: 'blur' }
                    ]
                }
            };
        },
        mounted() {
            //初始化
            this.init();
        },
        methods: {
            init(){
                var that = this;
                //省市县
                ajaxRequest.getCity.save(null, function(res){
                    res.data.data.forEach(element => {
                        that.options.push(element);
                    });
                });
                //西方city
                ajaxRequest.getWestCity.save(null, function(res){
                    that.list = res.data.data.map(item => {
                        return { value: item, label: item }
                    });
                });
            },
            handleCheckAllChange(val) {
                this.checkedCities = val ? cityOptions : [];
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.cities.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
            },
            remoteMethod(query) {
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        this.options4 = this.list.filter(item => {
                            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
                        });
                    }, 200);
                } else {
                    this.options4 = [];
                }
            },
            handleChange(){
                
            },

            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                       this.$refs[formName].resetFields();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>
