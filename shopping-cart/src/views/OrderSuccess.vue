<template>
    <div>
        <Car-Header></Car-Header>
        <Car-Bread>
            <span>OrderSuccess</span>
        </Car-Bread>
        <div class="container">
            <!-- 进度条 -->
            <div class="check-step">
                <ul>
                    <li class="cur"><span>确认</span> 地址</li>
                    <li class="cur"><span>查看</span> 订单</li>
                    <li class="cur"><span>付款</span> 方式</li>
                    <li class="cur"><span>订单</span> 确认</li>
                </ul>
            </div>
            <div class="order-create">
                <div class="order-create-pic">
                    <img src="./../../static/ok-2.png" alt="">
                </div>
                <div class="order-create-main">
                    <h3>恭喜你！<br>你的订单正在处理中!</h3>
                    <p>
                        <span>单号:{{orderId}}</span>
                        <span>订单总金额:{{ordertotal|currency('$')}}</span>
                    </p>
                    <div class="order-create-btn-wrap">
                        <div class="btn-l-wrap">
                            <router-link class="btn btn--m" to="/cart">购物车列表</router-link>
                        </div>
                        <div class="btn-r-wrap">
                            <router-link class="btn btn--m" to="/">商品列表</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Car-Footer></Car-Footer>
    </div>
</template>

<script>
import CarHeader from '@/components/CarHeader'
import CarBread from '@/components/CarBread'
import CarFooter from '@/components/CarFooter'
import axios from 'axios'

export default {
    data(){
        return{
            orderId:'',
            ordertotal:0
        }
    },
     components:{
        CarHeader,
        CarBread,
        CarFooter
    },
    mounted(){
        var orderId = this.$route.query.orderId
        if(!orderId){
            return;
        }
        axios.get('/users/orderDetail',{
            params:{
                orderId:orderId
            }
        }).then((response)=>{
            let res = response.data;
            if(res.status=='0'){
                this.orderId = orderId;
                this.ordertotal = res.result.orderTotal;
            }
        })
    }
}
</script>
