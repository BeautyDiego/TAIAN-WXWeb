<template>
	<div>
		<x-header :left-options="{showBack:false}">忘记密码</x-header>
		<group>
			<x-input title="姓名" placeholder="请输入用户名" v-model="validateForm.name" required >
			</x-input>
			<x-input title="证件号" placeholder="请输入证件号" v-model="validateForm.id_card" :min="6" :max="30"  required >
			</x-input>
			<x-input title="电话" placeholder="请输入联系电话" v-model="validateForm.mobile"  :max="13" is-type="china-mobile" required>
			</x-input>
		</group>
		<div style="padding:1rem 1rem 0">
			<flexbox>
				<flexbox-item >
					<p style="font-size: 1.4rem;">请先验证个人信息</p>
				</flexbox-item>
				<flexbox-item >
					<x-button style="background-color:#e59313;color:#fff"  @click.native="validateCoach">验证</x-button>
				</flexbox-item>
			</flexbox>
			
		</div>
		<div v-if="validated">
			<group>
				<x-input title="(99) 9-99" placeholder="密码" v-model="validateForm.new_pwd" type="password"  :min="6" :max="17" required >
					<span slot="label" style="padding-right:10px;display:block;" class="demo-icon">&#xe64e;</span>
				</x-input>
			</group>
			<div style="padding:1rem 1rem">
				<x-button type="warn"  @click.native="resetPwd">重置密码</x-button>
			</div>
		</div>
	
		<div style="padding-bottom:4rem"></div>
		<alert v-model="alertShow" title="提示" :content="alertContent"></alert>
	</div>
</template>

<script>
    import { Group, Cell,Blur,XButton,XInput,XHeader,XDialog,Alert,Flexbox,FlexboxItem} from 'vux'
    import { mapState, mapActions } from 'vuex'
    import {validateCoach,forgetPwd} from './../getData/getData'
    export default {
        components: {
            Cell,
            Group,
            Blur,
            XButton,
            XDialog,
            XInput,
            Alert,
            XHeader,
            Flexbox,
            FlexboxItem
        },
        methods: {
            async validateCoach(){
               
                if (this.validateForm.id_card&&this.validateForm.name&&this.validateForm.mobile){
                    const params=this.validateForm;
                    let res= await validateCoach(params);
                    if (res.success){
                        this.alertContent='验证通过';
                        this.alertShow=true;
                        this.validated=true;
                    }else{
                        this.alertContent=res.result;
                        this.alertShow=true;
                    }
                }else{
                    this.alertContent="请将表单填写完整";
                    this.alertShow=true;
                }
			},
            async resetPwd(){
                if (this.validateForm.new_pwd){
                    const params=this.validateForm;
                    let res= await forgetPwd(params);
                    if (res.success){
                        const me=this;
                        this.$vux.alert.show({
                            title: '提示',
                            content: '密码设置成功',
                            onHide () {
                                me.$router.push('/Redirect')
                            }
                        })

                    }else{
                        this.alertContent=res.result;
                        this.alertShow=true;
                    }
                }else{
                    this.alertContent="请填写密码";
                    this.alertShow=true;
                }
            },
        },
		created(){
            this.$store.commit("readAdminInfo");
		},
        mounted () {

        },
        activated(){
		    
        },
        beforeDestroy () {
        },
        watch: {
        
        },
        computed: {
            ...mapState({
                adminInfo: state => state.usercookie.adminInfo,
            }),
        },
        data () {
            return {
				personalInfo:{
                    DeName:'广东立腾',
					Name:'我是大哥',
                    Subject:'科目二',
					NickName:'Bruce',
                    IdCard:'42011116610241251',
					Phone:'18624447751'
				},
				validateForm:{
					id_card:'',
					name:'',
					mobile:'',
                    new_pwd:''
				},
				validated:false,
                alertShow:false,
                alertContent:'请填写原始密码和新密码',
            }
        }
    }
</script>

<style lang="less">

</style>
