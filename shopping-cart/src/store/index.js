import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

let store = new Vuex.Store({
    state:{
        returnName:'' ,//登陆成功后拿到的用户名
        cartCount:0 //购物车数量
    },
    mutations:{
        updateUseriInfor(state,returnName){
            state.returnName = returnName;
        },
        updatecartCount(state,cartCount){
            state.cartCount += cartCount;
        },
        initcartCount(state,cartCount){ //初始化
            state.cartCount = cartCount;
        }
    }
})

export default store;