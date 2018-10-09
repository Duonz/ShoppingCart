<template>
    <div>
        <Car-Header></Car-Header>
        <Car-Bread></Car-Bread>
        <div class="accessory-result-page accessory-page">
            <div class="container">
            <div class="filter-nav">
                <span class="sortby">
                    Sort by:
                </span>
                <a href="javascript:void(0)" class="default cur">
                    Default
                </a>
                <a @click="sortGoods"
                    href="javascript:void(0)" 
                    class="price">
                    Price 
                    <svg class="icon icon-arrow-short" :class="{'sort-up':!sortFlag}">
                        <use xlink:href="#icon-arrow-short">
                        </use>
                    </svg>
                </a>
                <a href="javascript:void(0)" class="filterby stopPop"
                    @click="showFilterPop"
                >
                    Filter by
                </a>
            </div>
            <div class="accessory-result">
            <!-- filter -->
                <div class="filter stopPop"  id="filter"
                    :class="{'filterby-show':filterBy}"
                >
                    <dl class="filter-price">
                        <dt>Price:</dt>
                        <dd>
                            <a href="javascript:void(0)"
                                :class="{'cur':priceChecked == 'all'}"
                                @click="setPriceFilter('all')"
                            >All</a>
                        </dd>
                        <dd v-for= "(item,index) in priceFilter" :key="index">
                            <a href="javascript:void(0)"
                                :class="{'cur':priceChecked == index}"
                                @click="setPriceFilter(index)"
                            >
                                {{item.startPrice}} - {{item.endPrice}}
                            </a>
                        </dd>
                    </dl>
                </div>

                <!-- search result accessories list -->
                <div class="accessory-list-wrap">
                    <div class="accessory-list col-4">
                        <ul>
                            <li v-for="(item,index) in goodsList" :key="index">
                                <div class="pic">
                                    <a href="#">
                                        <img
                                        :src="'./../../static/'+item.productImage" alt="">
                                    </a>
                                </div>
                                <div class="main">
                                    <div class="name">{{item.productName}}</div>
                                    <div class="price">{{item.salePrice}}</div>
                                    <div class="btn-area">
                                    <a href="javascript:;" 
                                        class="btn btn--m"
                                        @click="addCart(item.productId)"
                                    >加入购物车</a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                            <img src="./../../static/loading-svg/loading-spinning-bubbles.svg" v-show="loading">
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        <!-- 模态框-提示先登陆再加入购物车 -->
        <modal :mdShow=mdShow @close="closeModal">
            <p slot="message">
                请先登录，否则无法加入到购物车中！
            </p>
            <div slot="btnGroups">
                <a class="btn btn--m"
                    href="javascript:;" 
                    @click="mdShow=false"
                >
                    关闭
                </a>
            </div>
        </modal>
        <!-- 模态框-提示加入购物车成功 -->
        <modal :mdShow=mdShowCart @close="mdShowCart=false">
            <p slot="message">
                <svg class="icon-status-ok">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
                </svg>
                <span>加入购物车成功！</span>
            </p>
            <div slot="btnGroups">
                <a class="btn btn--m"
                    href="javascript:;" 
                    @click="mdShowCart=false">
                    继续购物
                </a>
                <router-link class="btn btn--m" href="javascript:;" to="/cart">查看购物车</router-link>
            </div>
        </modal>
        <!-- 遮罩 -->
        <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
        <Car-Footer></Car-Footer>
    </div>
</template>
<script>
import CarHeader from '@/components/CarHeader'
import CarBread from '@/components/CarBread'
import CarFooter from '@/components/CarFooter'
import Modal from '@/components/Modal'
import axios from 'axios'

export default {
    data(){
        return{
            goodsList:[],
            priceFilter:[
                {
                    startPrice:'0',
                    endPrice:'1000'
                },
                {
                    startPrice:'1000',
                    endPrice:'2000'
                },
                {
                    startPrice:'2000',
                    endPrice:'3000'
                },
                {
                    startPrice:'3000',
                    endPrice:'4000'
                }
            ],
            priceChecked:'all',//默认选择的all
            filterBy:false, //价格
            overLayFlag:false, //遮罩
            sortFlag:true,//默认升序
            page:1,//当前是第一页
            pageSize:8,//一页8条数据
            busy: false, //false是可以滚动，true滚动失效
            loading:false,
            mdShow:false,
            mdShowCart:false
        }
    },
    components:{
        CarHeader,
        CarBread,
        CarFooter,
        Modal
    },
    mounted(){
        this.getGoodsList();//初始化调用商品列表
    },
    methods:{
        //数据获取
        getGoodsList(flag){
            var parma = {
                page:this.page,
                pageSize:this.pageSize,
                sort:this.sortFlag?1:-1,
                priceLevel:this.priceChecked,
            }
            this.loading = true;
            axios.get('/goods/List',{
                params:parma
            }).then((response)=>{
                var res = response.data;
                this.loading = false;//获取完数据，关闭loading
                if(res.status == '0'){
                    if(flag){
                        this.goodsList = this.goodsList.concat(res.result.list);
                        if(res.result.count == 0){
                            this.busy = true;
                        }else{
                            this.busy = false;
                        }
                    }else{
                        this.goodsList = res.result.list;
                        this.busy = false;
                    }  
                }else{
                    this.goodsList = []
                }  
            })
        },
        showFilterPop(){
            this.filterBy=true;
            this.overLayFlag=true;
        },
        closePop(){
            this.filterBy=false;
            this.overLayFlag=false;
        },
        //排序
        sortGoods(){
            this.sortFlag = !this.sortFlag,
            this.page = 1,
            this.getGoodsList()
        },
        //点击价格区间调用的函数
        setPriceFilter(index){
            this.priceChecked = index;
            this.page = 1;
            this.getGoodsList();
            this.closePop();
        },
        //当鼠标滚动的时候调用的函数
        loadMore: function() {
            this.busy = true;
            setTimeout(() => {
                this.page++;
                this.getGoodsList(true);
            }, 500);
        },
        //加入购物车
        addCart(productId){
            axios.post('/goods/addCart',{
                productId:productId
            }).then((res)=>{
                console.log(res)
                if(res.data.status == 0){
                    this.mdShowCart = true; //显示加入购物车成功的模态框
                    this.$store.commit('updatecartCount',1)
                }else{
                    this.mdShow = true; //显示提示登陆的模态框
                }
            })
        },
        //关闭提示登陆的模态框
        closeModal(){
            this.mdShow = false;
        }


        
    }
}
</script>
