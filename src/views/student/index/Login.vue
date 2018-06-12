<template>
	<div v-if="isBinded" class="login-page">
		<div style="text-align: center">
			<img src="./../../../assets/img/stulogin.jpg" >
		</div>
		<box gap="20px 20px">
			
			<group>
				<x-input title="必须输入2333" placeholder="用户名" v-model="username" required @on-focus="isAndroid" @on-blur="onBlur">
					<span slot="label" style="padding-right:10px;display:block;" class="demo-icon">&#xe623;</span>
				</x-input>
				<x-input title="(99) 9-99" placeholder="密码" v-model="password" type="password"  :min="6" :max="9" required @on-focus="isAndroid" @on-blur="onBlur">
					<span slot="label" style="padding-right:10px;display:block;" class="demo-icon">&#xe64e;</span>
				</x-input>
			</group>
			<div style="height:3rem;">
				<div style="float:right;color:#7D6565;height:3rem;line-height: 3rem;font-size:1.2rem;"  @click="forgetPwd">
					忘记密码<span  class="demo-icon" style="font-size:1.2rem;color:#7D6565">&#xe605;</span>
				</div>
			</div>
			<x-button type="primary"  @click.native="submitLogin">登录</x-button>
		
		</box>
		<alert v-model="alertShow" title="提示" :content="alertContent"></alert>
	</div>
</template>

<script>
    import { Group,XInput,XButton ,Box,Alert,querystring } from 'vux'
    import {getUser,login} from './../getData/getData';

    export default {
        components: {
            Group,
            XInput,
            XButton,
            Box,
            Alert
        },
        methods: {
            async submitLogin(){
                if (this.username&&this.password){
                    let params={
                        username:this.username,
                        password:this.password,
                        nickname:this.UserInfo.nickname,
                        openid:this.UserInfo.openid,
                    };
                    let result= await login(params);
                    if (result.success){
                        this.alertContent='绑定成功';
                        this.alertShow=true;
                        this.$store.commit("saveAdminInfo", result.result);
                        this.$router.push('/personal');
                    }else{
                        this.alertContent=result.result;
                        this.alertShow=true;
					}

                }else{
                    this.alertContent='请填写用户名密码';
                    this.alertShow=true;
                }
            },
            async getUser(){
                let params=querystring.parse(window.location.search.substring(1,window.location.search.length));
                params.user_type=1;
                let res= await getUser(params);
                if (res.success){
                    if (res.result.cookie_value){
                        this.$store.commit("saveAdminInfo", res.result);
                        this.$router.push('/personal');
                    }
                }else{
                    this.isBinded=true;
                    this.UserInfo.openid=res.result.openid;
                    this.UserInfo.nickname=res.result.nick_name;
                }
            },
            isAndroid(){
                if (/(Android)/i.test(navigator.userAgent)){
                    if(document.activeElement.tagName=="INPUT" || document.activeElement.tagName=="TEXTAREA") {
                        window.setTimeout(function() {
                            document.querySelector('body').style.height = 'auto';
                            document.activeElement.scrollIntoView();
                        },0);
                    }
                }
            },
            onBlur(){
                if (/(Android)/i.test(navigator.userAgent)){
                    document.querySelector('body').style.height = '100%';
                }

            },
            /**
             * @method :忘记密码
             */
            forgetPwd(){
                this.$router.push('/ForgetPwd');
			},
            onBodyReady() {
                WeixinJSBridge.call('hideOptionMenu');
            },
        },
        created(){
            this.getUser()
           
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

        },
        watch: {

        },
        computed: {

        },
        data () {
            return {
                username: '',
                password: '',
                UserInfo:{
                    openid:'',
                    nickname:'',
                },
                alertShow:false,
                alertContent:'请填写用户名密码',
                isBinded:false,
            }
        }
    }
</script>

<style lang="less">
	.login-page{
		height:100%;
		background-color:#3bb5d3;
	}
	.login-page img{
		width:85%;
	}
	@font-face {
		font-family: 'iconfont';  /* project id 453948 */
		src: url('//at.alicdn.com/t/font_453948_m14g9vkcc82xogvi.eot');
		src: url('//at.alicdn.com/t/font_453948_m14g9vkcc82xogvi.eot?#iefix') format('embedded-opentype'),
		url('//at.alicdn.com/t/font_453948_m14g9vkcc82xogvi.woff') format('woff'),
		url('//at.alicdn.com/t/font_453948_m14g9vkcc82xogvi.ttf') format('truetype'),
		url('//at.alicdn.com/t/font_453948_m14g9vkcc82xogvi.svg#iconfont') format('svg');
	}
	
	.demo-icon {
		font-family: 'iconfont';
		font-size: 20px;
	}

</style>
