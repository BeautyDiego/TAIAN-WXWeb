
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import { InfiniteScroll } from 'mint-ui';

import Redirect from './Redirect'
import Login from './Login'
import Main from './Main'
import TeachPlan from './TeachPlan'
import MyAttendence from './MyAttendence'
import PersonalInfo from './PersonalInfo'
import WorkExamine from './WorkExamine'
import WorkExamineDetail from './WorkExamineDetail'
import MonthPlan from './MonthPlan'
import MonthPlanDetail from './MonthPlanDetail'
import ReservationDetails from './ReservationDetails'
import ForgetPwd from './ForgetPwd'


Vue.use(require('vue-wechat-title'))
Vue.use(VueRouter)
Vue.use(Vuex)
require('es6-promise').polyfill()

Vue.use(InfiniteScroll);
//注册全局没有图片的src地址；
Vue.prototype.NOPHOTO =  'this.src="' + require('./../../../assets/img/nophoto.png') + '"';
Vue.prototype.TABINDEX=2;
const routes = [
    {
        path: '/redirect',
        component: Redirect
    },
    {
        path: '/forgetPwd',
        meta: {
            title: '忘记密码'
        },
        component: ForgetPwd
    },
    {
        path: '/login',
        meta: {
            title: '登录'
        },
        component: Login
    },
    { path: '/', name:'main',component: Main,
        children: [
            { path: '/myattendence', name:'myattendence', meta: {
                title: '我的考勤'
            },component: MyAttendence},
            { path: '/personal', name:'personal', meta: {
                title: '个人中心'
            },component: PersonalInfo },
            { path: '/teachplan', name:'teachplan', meta: {
                title: '教学计划'
            },component: TeachPlan },
            { path: '/monthplan', name:'monthplan', meta: {
                title: '月度计划'
            },component: MonthPlan },
            { path: '/monthplandetail', name:'monthplandetail', meta: {
                title: '计划详情'
            },component: MonthPlanDetail },
            { path: '/reservationdetails', name:'reservationdetails', meta: {
                title: '预约详情'
            },component: ReservationDetails },
            { path: '/workexamine', name:'workexamine', meta: {
                title: '考勤审批'
            },component: WorkExamine },
            { path: '/workexaminedetail', name:'workexaminedetail', meta: {
                title: '考勤审批'
            },component: WorkExamineDetail }
        ]
    }

]
const router = new VueRouter({
    routes
})

import { DatetimePlugin, CloseDialogsPlugin, ConfigPlugin, BusPlugin, LocalePlugin, DevicePlugin, ToastPlugin, AlertPlugin, ConfirmPlugin, LoadingPlugin, WechatPlugin, AjaxPlugin, AppPlugin } from 'vux'
// plugins
Vue.use(DevicePlugin)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
Vue.use(WechatPlugin)
Vue.use(AjaxPlugin)
Vue.use(BusPlugin)
Vue.use(DatetimePlugin)

let store = new Vuex.Store({
    modules: {

    }
})
store.registerModule('vux', {
    state: {
        demoScrollTop: 0,
        isLoading: false,
        direction: 'forward',

    },
    mutations: {
        updateDemoPosition (state, payload) {
            state.demoScrollTop = payload.top
        },
        updateLoadingStatus (state, payload) {
            state.isLoading = payload.isLoading
        },
        updateDirection (state, payload) {
            state.direction = payload.direction
        },
    },
    actions: {
        updateDemoPosition ({commit}, top) {
            commit({type: 'updateDemoPosition', top: top})
        },
    }
})

store.registerModule('usercookie', {
    state: {
        adminInfo:'',
    },
    mutations: {
        saveAdminInfo(state, adminInfo){
            state.adminInfo=adminInfo;
            if(!window.localStorage){
                alert("请使用IE8+浏览器访问");
            }else{
                window.localStorage.setItem("adminInfo",JSON.stringify(adminInfo));
            }
        },
        readAdminInfo(state){
            if(!state.adminInfo){
                if(!window.localStorage){
                    alert("请使用IE8+浏览器访问");
                }else{
                    if (window.localStorage.getItem("adminInfo")) {
                        state.adminInfo = JSON.parse(window.localStorage.getItem("adminInfo")) ;
                    }
                }
            }
        },
    },
    actions: {
        saveAdminInfo({commit}, adminInfo){
            commit({type: 'saveAdminInfo', adminInfo: adminInfo})
        },
    }
})

store.registerModule('tabIndex', {
    state: {
        tabIndex:window.localStorage.getItem("tabIndexCoach")?parseInt(window.localStorage.getItem("tabIndexCoach")):2,
    },
    mutations: {
        updateTabIndex (state, tabIndex) {
            state.tabIndex = tabIndex.tabIndex;
            window.localStorage.setItem("tabIndexCoach",tabIndex.tabIndex);
        },
    },
    actions: {
        updateTabIndex ({commit}, tabIndex) {
            commit({type: 'updateTabIndex', tabIndex: tabIndex})
        },
    }
})


// simple history management
const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)

router.beforeEach(function (to, from, next) {
    store.commit('updateLoadingStatus', {isLoading: true})

    const toIndex = history.getItem(to.path)
    const fromIndex = history.getItem(from.path)

    if (toIndex) {
        if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
            store.commit('updateDirection', {direction: 'forward'})
        } else {
            store.commit('updateDirection', {direction: 'reverse'})
        }
    } else {
        ++historyCount
        history.setItem('count', historyCount)
        to.path !== '/' && history.setItem(to.path, historyCount)
        store.commit('updateDirection', {direction: 'forward'})
    }

    if (/\/http/.test(to.path)) {
        let url = to.path.split('http')[1]
        window.location.href = `http${url}`
    } else {
        next()
    }
})

router.afterEach(function (to) {
    store.commit('updateLoadingStatus', {isLoading: false})
    // if (process.env.NODE_ENV === 'production') {
    //     ga && ga('set', 'page', to.fullPath)
    //     ga && ga('send', 'pageview')
    // }
})

new Vue({
    router,
    store,
  render: h => h(App)
}).$mount('#app')
