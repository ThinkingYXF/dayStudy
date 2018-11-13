<template>
    <div class="wrapper">
        <el-row :gutter="20">
            <el-col :span="1"><div class="grid-content"></div></el-col>
            <el-col :span="6">
                <div class="grid-content bg-primary">
                    <div class="icon_div">
                        <div class="icon">
                            <i class="el-icon-star-off"></i>
                        </div>
                        <div class="text">
                            <h4>待办</h4>
                            <h3>10</h3>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="2"><div class="grid-content"></div></el-col>
            <el-col :span="6">
                <div class="grid-content bg-warning">
                    <div class="icon_div">
                        <div class="icon">
                            <i class="el-icon-message"></i>
                        </div>
                        <div class="text">
                            <h4>邮件</h4>
                            <h3>200</h3>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="2"><div class="grid-content"></div></el-col>
            <el-col :span="6">
                <div class="grid-content bg-danger">
                    <div class="icon_div">
                        <div class="icon">
                            <i class="el-icon-bell"></i>
                        </div>
                        <div class="text">
                            <h4>提醒</h4>
                            <h3>30</h3>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="1"><div class="grid-content"></div></el-col>
        </el-row>
    </div>
</template>
<script>
    export default{

    }
</script>

<style scoped>
    .grid-content {
        border-radius: 4px;
        min-height: 100px;
    }
    .bg-primary{
        background: #67C23A;
    }
    .bg-warning{
        background: #E6A23C;
    }
    .bg-danger{
        background: #F56C6C;
    }

    .icon_div{
        text-align: center;
        color: #fff;
        padding: 1em 0;
    }
    div.icon{
        font-size: 30px;
    }
    div.text h3{
        font-size: 25px;
    }
    div.text h4{
        font-size: 18px;
        padding: 10px 0;
    }
</style>
