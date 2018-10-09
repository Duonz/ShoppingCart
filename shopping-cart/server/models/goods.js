var mongoose = require('mongoose');
var Schema = mongoose.Schema; //定义表模型

//商品模型
var produtSchema = new Schema({
    "productId": String,
    "productName": String,
    "salePrice": Number,
    "productImage": String,
});

module.exports = mongoose.model('Good',produtSchema)
