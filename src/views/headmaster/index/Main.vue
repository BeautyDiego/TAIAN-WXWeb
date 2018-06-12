<template>
	<div >
		<transition
				@after-enter="$vux.bus && $vux.bus.$emit('vux:after-view-enter')"
				:name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')">
			<keep-alive >
				<router-view class="router-view" ></router-view>
			</keep-alive >
		
		</transition>
		<!--最下方的tabs-->
		<tabbar class="headmaster-tabbar"  style="position:fixed" v-model="tabIndex">
			<tabbar-item link="/home" >
				<span class="demo-icon-22" slot="icon" >&#xe671;</span>
				<span slot="label" >主页</span>
			</tabbar-item>
			<tabbar-item link="/workexamine">
				<span class="demo-icon-22" slot="icon">&#xe612;</span>
				<span slot="label">工作审批</span>
			</tabbar-item>
			<tabbar-item link="/personal">
				<span class="demo-icon-22" slot="icon">&#xe695;</span>
				<span slot="label">个人中心</span>
			</tabbar-item>
		</tabbar>
	</div>
</template>

<script>
    import {  Divider, Card, Flexbox, FlexboxItem,Radio, Group, Cell, Badge, Drawer, Actionsheet, ButtonTab, ButtonTabItem, ViewBox, XHeader, Tabbar, TabbarItem, Loading, TransferDom } from 'vux'
    import { mapState, mapActions } from 'vuex'

    export default {
        directives: {
            TransferDom
        },
        components: {
            Divider,
            Card,
            Flexbox,
            FlexboxItem,
            Radio,
            Group,
            Cell,
            Badge,
            Drawer,
            ButtonTab,
            ButtonTabItem,
            ViewBox,
            XHeader,
            Tabbar,
            TabbarItem,
            Loading,
            Actionsheet
        },
        methods: {
            ...mapActions([
                'updateDemoPosition'
            ]),
            onBodyReady() {
                WeixinJSBridge.call('hideOptionMenu');
            },
        },
        mounted () {
            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', this.onBodyReady, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', this.onBodyReady);
                    document.attachEvent('onWeixinJSBridgeReady', this.onBodyReady);
                }
            } else {
                this.onBodyReady();
            }
        },
        beforeDestroy () {
            this.box && this.box.removeEventListener('scroll', this.handler, false)
        },
        watch: {
        
        },
        computed: {
            ...mapState({
                route: state => state.route,
                path: state => state.route.path,
                deviceready: state => state.app.deviceready,
				demoTop: state => state.vux.demoScrollTop,
                isLoading: state => state.vux.isLoading,
                direction: state => state.vux.direction
            }),
            tabIndex:{
                get() {
                    return this.$store.state.tabIndex.tabIndex
                },
                set(newValue) {
                    this.$store.state.tabIndex.tabIndex = newValue
                }
            },
        },
        data () {
            return {
                showMenu: false,
                showMode: 'push',
                showModeValue: 'push',
                showPlacement: 'left',
                showPlacementValue: 'left',
            }
        }
    }
</script>

<style lang="less">
	@import '~vux/src/styles/reset.less';
	@import '~vux/src/styles/1px.less';
	@import '~vux/src/styles/tap.less';
	
	body {
		background-color: #fbf9fe;
		font-family:Helvetica;
	}
	html, body {
		height: 100%;
		width: 100%;
		overflow-x: hidden;
	}
	
	.card-demo-flex {
		display: flex;
		span{
			color: #f74c31;
		}
		img{
			width:80px;
			height:80px;
		}
	}
	.card-demo-content01 {
		padding: 10px 0;
	}
	.card-padding {
		padding: 15px;
	}
	.card-demo-flex > div {
		flex: 1;
		text-align: center;
		font-size: 12px;
	}
	
	.detail-header{
		padding:0.5rem 1.5rem;
		font-size:1.3rem;
	}
	.detail-icon {
		font-family: 'iconfont';
		font-size: 1.3rem;
		color: #888;
	}
	.flex-detail{
	  padding:0.5rem 1.5rem;
	  font-size:1.2rem;
		span{
			color: #f74c31;
		}
	}
	
	.demo-icon-22 {
		font-family: 'iconfont';
		font-size: 22px;
		color: #888;
	}
	.weui-tabbar.vux-demo-tabbar {
		backdrop-filter: blur(10px);
        background-color: none;
        background: rgba(247, 247, 250, 0.5);
	}
	.headmaster-tabbar .weui-bar__item_on .weui-tabbar__label,.headmaster-tabbar .weui-bar__item_on .weui-tabbar__icon span{
		color: #F70968!important;
	}
	.demo-icon-22:before {
		content: attr(icon);
	}
	.weui-tabbar__icon + .weui-tabbar__label {
		margin-top: 0!important;
	}
	.vux-demo-header-box {
		z-index: 100;
		position: absolute;
		width: 100%;
		left: 0;
		top: 0;
	}
	
	@font-face {
		font-family: 'iconfont';  /* project id 453948 */
		src: url('//at.alicdn.com/t/font_453948_vkhplagsv6jsv2t9.eot');
		src: url('//at.alicdn.com/t/font_453948_vkhplagsv6jsv2t9.eot?#iefix') format('embedded-opentype'),
		url('//at.alicdn.com/t/font_453948_vkhplagsv6jsv2t9.woff') format('woff'),
		url('//at.alicdn.com/t/font_453948_vkhplagsv6jsv2t9.ttf') format('truetype'),
		url('//at.alicdn.com/t/font_453948_vkhplagsv6jsv2t9.svg#iconfont') format('svg');
	}
	
	.demo-icon {
		font-family: 'iconfont';
		font-size: 20px;
	}
	
	.demo-icon-big {
		font-size: 28px;
	}
	
	.demo-icon:before {
		content: attr(icon);
	}
	
	.router-view {
		width: 100%;
		top: 46px;
	}
	.vux-pop-out-enter-active,
	.vux-pop-out-leave-active,
	.vux-pop-in-enter-active,
	.vux-pop-in-leave-active {
		will-change: transform;
		transition: all 500ms;
		height: 100%;
		top: 0;
		position: absolute;
		backface-visibility: hidden;
		perspective: 1000;
	}
	.vux-pop-out-enter {
		opacity: 0;
		transform: translate3d(-100%, 0, 0);
	}
	.vux-pop-out-leave-active {
		opacity: 0;
		transform: translate3d(100%, 0, 0);
	}
	.vux-pop-in-enter {
		opacity: 0;
		transform: translate3d(100%, 0, 0);
	}
	.vux-pop-in-leave-active {
		opacity: 0;
		transform: translate3d(-100%, 0, 0);
	}
	.menu-title {
		color: #888;
	}
</style>
