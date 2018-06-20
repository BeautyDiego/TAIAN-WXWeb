<template>
	<div >
		<div ref="wrapper" :style="{ height: wrapperHeight + 'px' }" style="overflow: scroll;-webkit-overflow-scrolling:touch;">
			<group title="考勤申请审批信息">
				<cell title="教练员"  :value="queryParams.coach_name"></cell>
				<cell title="所属驾校"  :value="queryParams.dename"></cell>
				<cell title="日期"  :value="queryParams.change_date"></cell>
				<cell title="时间" :value="daySpanFormat(queryParams.day_span)" ></cell>
				<cell title="科目" :value="subjectFormat(queryParams.subject)" ></cell>
				<cell title="加班价格" :value="priceFormat(queryParams.price)" ></cell>
				<cell title="申请类型" :value="worktypeFormat(queryParams.work_type)" ></cell>
				<cell title="申请时间" :value="datetimeFormat(queryParams.ask_time)" ></cell>
				<cell title="申请原因" :value="queryParams.ask_remark" ></cell>
				<cell title="审批人" :value="queryParams.handle_name" ></cell>
				<cell title="审批时间" :value="datetimeFormat(queryParams.handle_time)" ></cell>
				<cell title="审批状态" :value="askstatusFormat(queryParams.ask_status)" ></cell>
				<x-textarea v-if="queryParams.ask_status!=1" title="审批备注:"  :value="queryParams.handle_remark" readonly ></x-textarea>
				<x-textarea v-if="queryParams.ask_status==1" title="审批备注:" v-model="handleForm.remark"></x-textarea>
				<checker v-if="queryParams.ask_status==1" style="padding:5px 12px;"  type="radio" v-model="handleForm.handle" default-item-class="checker-item" selected-item-class="checker-item-selected">
					<checker-item :value="1">同意</checker-item>
					<checker-item :value="2">驳回</checker-item>
				</checker>
			</group>
			<div v-if="queryParams.ask_status==1" style="padding:1rem 1rem">
				<x-button type="primary"  @click.native="handleApply">提交审批</x-button>
			</div>
			<alert v-model="alertShow" title="提示" :content="alertContent"></alert>
		</div>
		
	</div>
	
</template>

<script>
    import { Group,Cell,XButton,CellBox, XInput,Alert,XTextarea,Checker,CheckerItem } from 'vux'
    import { mapState, mapActions } from 'vuex'
	import {handleAddWork,handleAskOff} from './../getData/getData'
    export default {
        components: {
            Cell,
            Group,
            XButton,
            XInput,
			Alert,
            XTextarea,
            Checker,
            CheckerItem
        },
        methods: {
            daySpanFormat(value){
                if(value == 1){
                    return '上午'
                }else if(value ==2 ){
                    return '下午'
                }else if (value ==3){
                    return '晚上'
                }else{
                    return ''
                }
            },
            subjectFormat(value){
                if(value == 2){
                    return '科目二'
                }else if(value ==3 ){
                    return '科目三'
                }else{
                    return ''
                }
			},
            priceFormat(value){
                if(value){
                   return value+'￥/小时'
                }else{
                    return ''
				}
            },
            worktypeFormat(value){
                if(value == 1){
                    return '请假'
                }else if(value ==2 ){
                    return '加班'
                }else{
                    return ''
                }
            },
            datetimeFormat(value){
              if(value){
                  return value.replace("T", " ");
              }else{
                  return ''
			  }
			},
			askstatusFormat(value){
                if(value == 1){
                    return '审批中'
                }else if(value ==2 ){
                    return '已取消'
                }else if (value ==3){
                    return '已驳回'
                }else if (value ==4){
                    return '已通过'
                }else{
                    return ''
                }
			},
			//操作申请
            async handleApply(){
			    let params={id:this.queryParams.id};
                let result={};
			    if (this.queryParams.work_type==1){  //请假
                     result= await handleAskOff(this.handleForm,this.adminInfo.cookie_value);
				}else{
                    result= await handleAddWork(this.handleForm,this.adminInfo.cookie_value);
                }
              
                if (result.success){
                    this.$vux.toast.show({
                        text: '提交成功'
                    });
                    let me=this;
                    setTimeout( function () {
                        me.$router.replace('/workexamine')
                    } ,1000);
                  
                }else{
                    this.alertContent=result.result;
                    this.alertShow=true;
                }
            },
            ...mapActions([
                'updateTabIndex'
            ]),
        },
		created(){
            this.$store.commit("readAdminInfo");
		},
        mounted () {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top-50;
        },
        activated(){
            this.updateTabIndex(1);//用于留住tabIndex
            this.queryParams= this.$route.query.item;
            this.handleForm.id = this.queryParams.id;
            this.alertShow=false;
            this.handleForm.handle = 1;
            this.handleForm.remark = '';
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
                showloading:true,
                alertShow:false,
                alertContent:'',
                queryParams:{},
                wrapperHeight:0,
				handleForm:{
                    id:1,
                    handle:1,
					remark:''
				},
            }
        }
    }
</script>

<style lang="less" scoped>
	.checker-item {
		width: 100px;
		height: 26px;
		line-height: 26px;
		text-align: center;
		border-radius: 3px;
		border: 1px solid #ccc;
		background-color: #fff;
		margin-right: 6px;
	}
	.checker-item-selected {
		background: #ffffff url(../../../assets/img/active.png) no-repeat right bottom;
		border-color: #ff4a00;
	}
</style>
