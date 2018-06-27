<template>
	<div>
		<blur :blur-amount=20 :url=" adminInfo.head_image" :height=160>
			<p class="center"><img :src="adminInfo.head_image?adminInfo.head_image:'./../../../static/img/nophoto.png'" :onerror="NOPHOTO" ></p>
		</blur>
		<group title="学员信息">
			<cell title="姓名"  :value="adminInfo.name"></cell>
			<cell title="所属驾校" :value="adminInfo.dename" ></cell>
			<cell title="在培科目" :value="adminInfo.subjext_text" ></cell>
			<cell title="微信昵称" :value="adminInfo.nick_name" ></cell>
			<cell title="证件号" :value="formatedIdCard" ></cell>
			<cell title="电话" :value="adminInfo.mobile" ></cell>
		</group>
		<group title="列表管理">
			<cell title="培训信息" link="/trainInfo" >
				<span slot="icon" class="demo-icon" style="margin-right:0.5rem;color:#6fc777" >&#xe601;</span>
			</cell>
			<cell title="考试信息" link="/examinfo" >
				<span slot="icon" class="demo-icon" style="margin-right:0.5rem;color:#e85e6f">&#xe60a;</span>
			</cell>
		</group>
		<group title="投诉管理">
			<cell title="投诉" link="/complain" >
				<span slot="icon" class="demo-icon" style="margin-right:0.5rem;color:#F3840F" >&#xe6dd;</span>
			</cell>
		</group>
		<div style="padding:1rem 1rem">
			<div style="height:2.5rem;">
				<div style="float:right;color:#7D6565"  @click="modifyPwd">
					修改密码<span  class="demo-icon" style="font-size:1rem;color:#7D6565">&#xe605;</span>
				</div>
			</div>
			<x-button type="warn"  @click.native="Logout">退出登录</x-button>
		</div>
		<div style="padding-bottom:4rem"></div>
		<div v-transfer-dom>
			<x-dialog v-model="showModifyPwd" :hide-on-blur="true" :dialog-style="{width:'100%',padding:'1rem',background:'#eee'}">
				<h3>密码修改</h3>
				<group>
					<x-input title="(99) 9-99" placeholder="原始密码" v-model="old_pwd" type="password"  :min="6" :max="9" required >
						<span slot="label" style="padding-right:10px;display:block;" class="demo-icon">&#xe64e;</span>
					</x-input>
					<x-input title="(99) 9-99" placeholder="新密码" v-model="new_pwd" type="password"  :min="6" :max="9" required >
						<span slot="label" style="padding-right:10px;display:block;" class="demo-icon">&#xe64e;</span>
					</x-input>
				</group>
				<x-button type="primary" style="margin-top:1rem" @click.native="submitModifyPwd">确认修改</x-button>
			</x-dialog>
			<alert v-model="alertShow" title="提示" :content="alertContent" :mask-z-index="2000" ></alert>
		</div>
	</div>
</template>

<script>
    import { Group, Cell,Blur,XButton,XInput,XDialog,Alert,TransferDomDirective as TransferDom} from 'vux'
    import { mapState, mapActions } from 'vuex'
    import {logout,modifyPwd} from './../getData/getData'
    export default {
        directives: {
            TransferDom
        },
        components: {
            Cell,
            Group,
            Blur,
            XButton,
            XDialog,
            XInput,
            Alert
        },
        methods: {
            async Logout(){
                let res= await logout({},this.adminInfo.cookie_value);
                this.$router.push('/Redirect');
            },
            modifyPwd(){
                this.showModifyPwd=true;
            },
            async submitModifyPwd(){
                if (this.old_pwd&&this.new_pwd){
                    let params={
                        old_pwd:this.old_pwd,
                        new_pwd:this.new_pwd,
                    };
                    let result= await modifyPwd(params,this.adminInfo.cookie_value);
                    if (result.success){
                        this.alertContent='修改成功';
                        this.alertShow=true;
                        this.showModifyPwd=false;
                    }else{
                        this.alertContent=result.result;
                        this.alertShow=true;
                    }

                }else{
                    this.alertContent='请填写原始密码和新密码';
                    this.alertShow=true;
                }
            },
            ...mapActions(['updateTabIndex']),
        },
		created(){
            this.$store.commit("readAdminInfo");
		},
        mounted () {
            console.log(this.adminInfo);
            this.$store.state.tabIndex.tabIndex=2; //用于留住tabIndex
        },
        activated(){
            this.updateTabIndex(2);
        },
        beforeDestroy () {
        },
        watch: {
        
        },
        computed: {
            ...mapState({
                adminInfo: state => state.usercookie.adminInfo,
            }),
			formatedIdCard:function () {
				let idCard=this.adminInfo.id_card;
				if (idCard.length>10){
                    return idCard.substring(0,5)+'*****'+idCard.substring(idCard.length-10)
				}else{
                    return idCard.substring(0,5)+'*****'
                }
				
            }
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
                showModifyPwd:false,
                old_pwd:'',
                new_pwd:'',
                alertShow:false,
                alertContent:'请填写原始密码和新密码',
            }
        }
    }
</script>

<style lang="less">
	.center {
		text-align: center;
		padding-top: 20px;
		color: #fff;
		font-size: 18px;
	}
	.center img {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		border: 4px solid #ececec;
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
</style>
