<template>
	<div>
		<group label-width="4.5em" label-margin-right="2em" label-align="right">
			<popup-picker title="投诉类别" :data="list" v-model="complainForm.ctype" value-text-align="left" @on-hide="onPickerHide"></popup-picker>
			<x-input title="投诉对象" placeholder="请填写教练员手机号" v-model="complainForm.target" :disabled="complainForm.ctype[0]=='驾校'"></x-input>
			<x-textarea title="投诉详情" placeholder="请填写详细信息" :max="20" :show-counter="false" :rows="3" v-model="complainForm.content"></x-textarea>
			<x-button type="primary" @click.native="submitComplain" style="margin-top:4rem;">提交</x-button>
		</group>
		<alert v-model="alertShow" title="提示" :content="alertContent" :mask-z-index="2000" @on-hide="HideAlert" ></alert>
	</div>
</template>

<script>
    import { GroupTitle, Group, Cell, XInput, Selector,XTextarea,PopupPicker,XButton,Alert} from 'vux'
	import {complaint} from './../getData/getData';
    import { mapState, mapActions } from 'vuex'
    export default {
        components: {
			Group,
            XButton,
            GroupTitle,
            Cell,
            XInput,
            Selector,
            XTextarea,
            PopupPicker,
            Alert
        },
        methods: {
           async submitComplain(){
               let params={};
               if (this.complainForm.ctype[0]==='驾校'){
                   params.c_type=2;
			   }else{
                   params.c_type=1;
			   }
			   if (this.complainForm.target&&this.complainForm.content){
                   params.target=this.complainForm.target;
                   params.content=this.complainForm.content;
                   let res=await complaint(params,this.adminInfo.cookie_value);
                   if (res.success){
                       this.alertContent='投诉成功';
                       this.IsComplainSuccess=true;
                       this.alertShow=true;
                   }else{
                       this.alertContent=res.result;
                       this.alertShow=true;
                   }
			   }else{
                   this.alertContent='请填写投诉对象和投诉内容';
                   this.alertShow=true;
			   }
      
		   },
            onPickerHide(){
               if (this.complainForm.ctype[0]=='教练员'){
                   this.complainForm.target='';
			   }else{
                   this.complainForm.target=this.adminInfo.dename;
			   }
      
			},
            HideAlert(){
               
               this.IsComplainSuccess&&this.$router.replace('personal')
			},
            ...mapActions([
                'updateTabIndex'
            ]),
        },
		created(){
            this.$store.commit("readAdminInfo");
		},
        mounted () {
        
        },
        activated(){
            this.updateTabIndex(2);//用于留住tabIndex
            this.complainForm.ctype= ['驾校'];
			this.complainForm.target=this.adminInfo.dename;
			this.complainForm.content = ''
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
                list: [['驾校', '教练员']],
				complainForm:{
                    ctype:['驾校'],
                    target  :'',
                    content:''
				},
                alertShow:false,
                alertContent:'',
				IsComplainSuccess:false,
            }
        }
    }
</script>

<style lang="less">
	.list-detail-wrapper{
		display:flex;
		flex-direction: row;
		width:100%;
		
	}
	.list-detail-div{
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
		min-width: 0;
		-webkit-box-align: center; -moz-box-align: center; /*混合版本语法*/
		-ms-flex-align: center; /*新版本语法*/
		-webkit-align-items: center;
		align-items: center;
	}
	.traininfo-detail{
		line-height:2rem;
		font-size:2rem;
		padding:1.5rem;
	}
</style>
