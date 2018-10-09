var express = require('express');
var router = express.Router(); //拿到espress框架路由
var mongoose = require('mongoose');
var Goods = require('../models/goods'); //模型表

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall');
//链接成功
mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success.")
});
//链接失败
mongoose.connection.on("error", function () {
  console.log("MongoDB connected fail.")
});
//断开
mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected.")
});

//查询商品列表数据（条件查询、分页、排序）
router.get('/List',function(req,res,next){
    let page = parseInt(req.param('page'));//当前页码
    let pageSize = parseInt(req.param('pageSize'));//每夜有多少条数据
    let priceLevel = req.param('priceLevel');//价格过滤
    let sort = req.param('sort');//排序
    let skip = (page-1)*pageSize;//分页公式
    var priceGt = '';//大于最小区间
    var priceLte = ''; //小于等于
    let params = {}; //条件查询
    //根据不同的价格区间显示对应的商品列表
    if(priceLevel != 'all'){
        switch(priceLevel){
            case '0':priceGt = 0; priceLte = 1000;break;
            case '1':priceGt = 1000; priceLte = 2000;break;
            case '2':priceGt = 2000; priceLte = 3000;break;
            case '3':priceGt = 3000; priceLte = 4000;break;
        }
        params = { 
            salePrice:{ //金额过滤的条件
                $gt:priceGt,
                $lte:priceLte
            }
        }
    }
  
    let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
    goodsModel.sort({'salePrice':sort}) //通过价格排序
    goodsModel.exec(function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            res.json({
                status:'0',
                msg:'',
                result:{
                    count:doc.length,
                    list:doc
                }
            })
        }
    })
})

//加入购物车
router.post('/addCart',function(req,res,next){
  var userId = '100000077',productId = req.body.productId;
  var User = require('../models/user')
  User.findOne({userId:userId},function(err,userdoc){
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{ //拿到用户信息
      //console.log("userdoc:"+userdoc); 
      if(userdoc){ //如果拿到了，插入到用户的购物车列表里
        let goodsItem = ''; //商品信息
        userdoc.cartList.forEach(function(item){
          if(item.productId == productId){ //如果购物车里已经有了，就数量加
            goodsItem = item;
            item.productNum ++;
          }
        });
        if(goodsItem){ 
          userdoc.save(function(err2,doc2){
            if(err2){
              res.json({
                status:'1',
                msg:err3.message
              })
            }else{
              res.json({
                status:'0',
                msg:'',
                result:'suc'
              })
            }
          })
        }else{
          Goods.findOne({productId:productId},function(err1,doc){
            if(err1){
              res.json({
                status:'1',
                msg:err1.message
              })
            }else{
              if(doc){
                userdoc.cartList.push({
                  "productId": doc.productId,
                  "productName": doc.productName,
                  "salePrice": doc.salePrice,
                  "productImage": doc.productImage,
                  "productNum":1,
                  "checked":1,
                });
                userdoc.save(function(err2,doc2){
                  if(err2){
                    res.json({
                      status:'1',
                      msg:err3.message
                    })
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:'suc'
                    })
                  }
                })
              }
            }
          })
        }
        
      }
    }
  })

})

module.exports = router;