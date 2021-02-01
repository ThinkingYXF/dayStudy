var express = require('express');
var app = express();
app.use(express.static('../../web'));
// app.use(express.static('../../../dayStudy/vue/my-project/vueDemo'));
app.listen(8082);