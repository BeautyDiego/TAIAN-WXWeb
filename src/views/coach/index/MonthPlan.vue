<template>
	<div >
		<div style="padding:0.5rem;" >
			<button-tab>
				<button-tab-item @on-item-click="changeMonth(0)" selected>本月计划</button-tab-item>
				<button-tab-item @on-item-click="changeMonth(1)">下月计划</button-tab-item>
			</button-tab>
		</div>
		<div ref="wrapper" :style="{ height: wrapperHeight + 'px' }" style="overflow: scroll;-webkit-overflow-scrolling : touch;">
			<div  class="planlist" v-for="(item,index) in monthPlanList" :key="index">
				<div class="plan-date">{{item.PlanDate}}</div>
				<flexbox :gutter=10>
					<flexbox-item v-for="(plan,Pindex) in item.PlanList" :key="Pindex">
						<flexbox orient="vertical" class="list-part" @click.native="appointDetail(plan.SubjectId,plan.PlanDaySpan,plan.PlanDate)">
							<flexbox-item  class="list-part-row" style="margin-top:2px;position:relative">
								{{subjectName(plan.SubjectId,plan.ChangePlan)}}	<span  class="demo-icon morning" style="font-size:1.6rem;position: absolute; right: 0.4rem;top: -0.8rem;">{{plan.PlanDaySpan==1?'&#xe603;':plan.PlanDaySpan==2?'&#xe60a;':'&#xe609;'}}</span>
							</flexbox-item>
							<flexbox-item class="list-part-row" style="margin-top:2px">
								{{(plan.SubjectId==0||plan.Price==0)?'-':'￥'+plan.Price+' /小时'}}
							</flexbox-item>
							<flexbox-item class="list-part-row" style="margin-top:2px">
								{{plan.PreBookNum}}人预约
							</flexbox-item>
							<flexbox-item class="list-part-btn" style="margin-top:2px">
								<span class="row-btn" @click.stop="planHandle(plan.AskStatus,plan.ChangePlan,plan.SubjectId,plan.PlanDaySpan,plan.PlanDate,plan.PreBookNum)">{{handleName(plan.SubjectId,plan.ChangePlan,plan.AskStatus)}}</span>
							</flexbox-item>
						</flexbox>
					</flexbox-item>
				</flexbox>
			</div>
			<div style="padding-bottom:4rem"></div>
		</div>
		<div v-transfer-dom>
			<popup v-model="showAddWorkPopup">
				<!-- group already has a top border, so we need to hide header's bottom border-->
				<popup-header
						left-text="取消"
						right-text="确定"
						title="请选择"
						:show-bottom-border="false"
						@on-click-left="showAddWorkPopup = false"
						@on-click-right="onAddWorkConfirm"></popup-header>
				<group :gutter=0>
					<x-input  title="加班原因" v-model="handleAttendenceForm.reason" placeholder="请输入加班原因"  ></x-input>
					<x-input v-if="radioSubjectValue" title="￥" v-model="handleAttendenceForm.price" placeholder="请输入金额" type="number" @on-change="moneyChange" ></x-input>
					<radio :options="subjectOptions" v-model="radioSubjectValue" ></radio>
				</group>
			</popup>
		</div>
		<div v-transfer-dom>
			<confirm v-model="showCancelHandlePopup"
					 :show-input="true"
					 :placeholder="cancelHandlePlaceHolder"
					 ref="confirmAskOff"
					 :title="cancelHandleTitle"
					 @on-cancel="onCancelHandleCancel"
					 @on-confirm="onCancelHandleConfirm">
			</confirm>
		</div>
		
	</div>
</template>

<script>

    import { Group, CellBox, Flexbox, FlexboxItem,ButtonTab, ButtonTabItem,XButton,Popup,PopupHeader,Radio,TransferDom,Confirm,XInput} from 'vux'
	import {getMonthPlan,askOff,addWork,cancelAskOff,cancelAddWork} from './../getData/getData'
    import { mapState, mapActions } from 'vuex'
    export default {
        directives: {
            TransferDom
        },
        components: {
            CellBox,
            Flexbox,
            FlexboxItem,
			ButtonTab,
			ButtonTabItem,
            XButton,
            Popup,
            Radio,
			Group,
            PopupHeader,
            Confirm,
            XInput
        },
        methods: {
            async getMonthPlan(){
                this.$vux.loading.show({
                    text: '加载中'
                });
                let res= await getMonthPlan({month:this.selectedmonth},this.adminInfo.cookie_value);
                if (res.success){
                    this.monthPlanList=res.result;
                    console.log(res.result)
				}
                this.$vux.loading.hide()
            },
            async doAskOff(){
                this.$vux.loading.show({
                    text: '加载中'
                });
                let res= await askOff(this.handleAttendenceForm,this.adminInfo.cookie_value);
                if (res.success){
                    this.$vux.toast.show({
                        text: '请假申请成功',
                        width:'12rem',
                    })
					this.getMonthPlan();
                }else{
                    this.$vux.toast.show({
						type:'cancel',
                        text: res.result,
						width:'18rem',
                    })
				}
                this.handleAttendenceForm.reason='';
                this.$vux.loading.hide()
            },
			async doCancelAskOff(){
                this.$vux.loading.show({
                    text: '加载中'
                });
                let res= await cancelAskOff(this.handleAttendenceForm,this.adminInfo.cookie_value);
                if (res.success){
                    this.$vux.toast.show({
                        text: '取消成功',
                    })
                    this.getMonthPlan();
                }else{
                    this.$vux.toast.show({
                        type:'cancel',
                        text: res.result,
                    })
                }
                this.handleAttendenceForm.reason='';
                this.$vux.loading.hide()
			},
            async doCancelAddWork(){
                this.$vux.loading.show({
                    text: '加载中'
                });
                let res= await cancelAddWork(this.handleAttendenceForm,this.adminInfo.cookie_value);
                if (res.success){
                    this.$vux.toast.show({
                        text: '取消成功',
                    })
                    this.getMonthPlan();
                }else{
                    this.$vux.toast.show({
                        type:'cancel',
                        text: res.result,
						width:'16rem',
                    })
                }
                this.handleAttendenceForm.reason='';
                this.$vux.loading.hide()
            },
            async doAddWork(){
                this.$vux.loading.show({
                    text: '加载中'
                });
                let params=JSON.parse(JSON.stringify(this.handleAttendenceForm));
                params.price=parseInt(params.price);
                let res= await addWork(params,this.adminInfo.cookie_value);
                if (res.success){
                    this.$vux.toast.show({
                        text: '加班申请成功',
                        width:'12rem',
                    })
                    this.getMonthPlan();
                }else{
                    this.$vux.toast.show({
                        type:'cancel',
                        text: res.result,
                        width:'16rem',
                    })
                }
                this.radioSubjectValue='';
                this.handleAttendenceForm.price='';
                this.$vux.loading.hide()
            },
            changeMonth(value){
				this.selectedmonth=value;
				this.getMonthPlan();
			},
            planHandle(AskStatus,changePlan,SubjectId,PlanDaySpan,PlanDate,PreBookNum){
                this.handleAttendenceForm.day=PlanDate;
                this.handleAttendenceForm.dayspan=PlanDaySpan;
                this.handleAttendenceForm.subject=SubjectId;
                this.changePlanStatus=changePlan;
                if (AskStatus==0){
                    if (changePlan==0){
                        if (SubjectId==0){ //加班
                            this.showAddWorkPopup=true;
                            this.radioSubjectValue='';
                        }else{ //请假
                            if (PreBookNum==0){ //没有人预约才能请假
                                this.showCancelHandlePopup=true;
                                this.cancelHandlePlaceHolder='请输入请假原因';
                                this.cancelHandleTitle='确认请假';
                            }else{
                                this.$vux.alert.show({
                                    title: '警告',
                                    content: '已有学员预约，无法请假',
                                    width:'16rem',
                                })
                            }

                        }
                    }
				}
//                if (changePlan==0){
//                    if (SubjectId==0){ //加班
//                        this.showAddWorkPopup=true;
//                        this.radioSubjectValue='';
//                    }else{ //请假
//                        if (PreBookNum==0){ //没有人预约才能请假
//                            this.showCancelHandlePopup=true;
//                            this.cancelHandlePlaceHolder='请输入请假原因';
//                            this.cancelHandleTitle='确认请假';
//                        }else{
//                            this.$vux.alert.show({
//                                title: '警告',
//                                content: '已有学员预约，无法请假',
//                                width:'16rem',
//                            })
//                        }
//
//                    }
//				}else if (changePlan==1){
//                    this.showCancelHandlePopup=true;
//                    this.cancelHandlePlaceHolder='取消请假原因';
//                    this.cancelHandleTitle='取消请假';
//				}else if (changePlan==2){
//                    this.showCancelHandlePopup=true;
//                    this.cancelHandlePlaceHolder='取消加班原因';
//                    this.cancelHandleTitle='取消加班';
//                }else if (changePlan==3){
//                    this.showCancelHandlePopup=true;
//                    this.cancelHandlePlaceHolder='取消加班原因';
//                    this.cancelHandleTitle='取消加班';
//                }
    
				
			},
            onCancelHandleCancel(){
                this.handleAttendenceForm.reason='';
			},
            onCancelHandleConfirm(value){
                this.handleAttendenceForm.reason=value;
                if (this.changePlanStatus==0){
                   this.doAskOff();
                }else if (this.changePlanStatus==1){
                    this.doCancelAskOff();
                }else if (this.changePlanStatus==2){
                    this.doCancelAddWork();
                }else if (this.changePlanStatus==3){
                    this.doCancelAddWork();
                }
			},
            moneyChange(value){
                this.handleAttendenceForm.price=parseInt(value);
			},
            onAddWorkConfirm(){
                if (this.radioSubjectValue){
                    if (parseInt(this.handleAttendenceForm.price)<1000&&parseInt(this.handleAttendenceForm.price)>0){
                        this.showAddWorkPopup = false;
                        this.handleAttendenceForm.subject=this.radioSubjectValue;
                        this.doAddWork();
					}else{
                        this.$vux.toast.show({
                            type:'text',
                            text: '培训价格大于￥0小于￥999的整数',
							width:'18rem'
                        })
					}
				}else{
                    this.$vux.toast.show({
                        type:'text',
                        text: '请选择加班项目',
						width:'10rem'
                    })
				}
    
			},
            appointDetail(SubjectId,PlanDaySpan,PlanDate){
                if (SubjectId==2||SubjectId==3){
                    this.$router.push('/monthplandetail');
                    this.$router.push({ path: 'monthplandetail', query: {day:PlanDate,dayspan:PlanDaySpan }});
				}
    
			},
            timeSpanColor(value){
                if (!value){
                    return ''
                } else if (value ==1){
                    return 'morning'
                }else if (value ==2){
                    return 'afternoon'
                }else if (value ==3){
                    return 'night'
                }else{
                    return ''
                }
            },
            timeSpanIcon(value){
                if (!value){
                    return ''
                } else if (value ==1){
                    return '&#xe603;'
                }else if (value ==2){
                    return '&#xe60a;'
                }else if (value ==3){
                    return '&#xe609;'
                }else{
                    return ''
                }
            },
            subjectName(SubjectId,changePlan){
                if (changePlan==0){
                    if (SubjectId ==2){
                        return '科目二'
                    }else if (SubjectId ==3){
                        return '科目三'
                    }else if (SubjectId ==0){
                        return '不出勤'
                    }else{
                        return ''
                    }
				}else if (changePlan==1){
                    return '已请假'
				}else if (changePlan==2){
                    return '科目二加班'
                }else if (changePlan==3){
                    return '科目三加班'
                }
                
				
            },
            handleName(SubjectId,changePlan,AskStatus){
                    if (SubjectId == 2) {
                        if(AskStatus==0||AskStatus==2)
                         return '请假'
                        if(AskStatus==1)
                         return '请假申请中'
                        if(AskStatus==3)
                         return '请假已驳回'
                        if(AskStatus==4)
                         return '已加班'
                    } else if (SubjectId == 3) {
                        if(AskStatus==0||AskStatus==2)
                         return '请假'
                        if(AskStatus==1)
                         return '请假申请中'
                        if(AskStatus==3)
                         return '请假已驳回'
                        if(AskStatus==4)
                         return '已加班'
                    } else if (SubjectId == 0) {
                        if(AskStatus==0||AskStatus==2)
                         return '加班'
                        if(AskStatus==1)
                         return '加班申请中'
                        if(AskStatus==3)
                         return '加班已驳回'
                        if(AskStatus==4)
                         return '已请假'
                    } else {
                        return ''
                    }
                
//                }else if (changePlan==1){
//                    return '取消请假'
//                }else if (changePlan==2){
//                    return '取消加班'
//                }else if (changePlan==3){
//                    return '取消加班'
//                }
            },
            ...mapActions([
                'updateTabIndex'
            ]),
        },
        ready(){
        },
		created(){
  
          
		},
        mounted () {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
			
        },
        activated(){
            this.updateTabIndex(0);//用于留住tabIndex
            this.$store.commit("readAdminInfo");
            this.sub_part= this.$route.params.subject;
            this.getMonthPlan();
        },
        beforeDestroy () {
        },
        watch: {
        
        },
        computed: {
            ...mapState({
                adminInfo: state => state.usercookie.adminInfo,
            }),
			subjectText(){
                 if ( this.sub_part==1){
                     return '一'
				 }else if (this.sub_part==2){
                     return '二'
				 }else if (this.sub_part==3){
                     return '三'
                 }else{
                     return '四'
				 }
			}
        },
        data () {
            return {
                wrapperHeight:0,
                selectedmonth:0,
				monthPlanList:[],
                subjectOptions:[{
                    key: '2',
                    value: '科目二'
                },{
                    key: '3',
                    value: '科目三'
                }],
                showAddWorkPopup:false,
				handleAttendenceForm:{ //改变请假和加班的提交form
                   	day:'',
					dayspan:'',
					subject:'',
					reason:'',
					price:'',
				},
				changePlanStatus:'',
                radioSubjectValue:'',
                inputPriceValue:'',//申请加班时候的填写金额
                showCancelHandlePopup:false,
				cancelHandlePlaceHolder:'',
                cancelHandleTitle:'',
				
                
            }
        }
    }
</script>

<style lang="less" scoped>
   .planlist{
	   padding:0.6rem;
	   font-size:1.2rem;
	   .plan-date{
		   padding:0.4rem ;
		   font-size:1.4rem;
		   font-weight: bold;
		   color:#888888;
	   }
	   .list-part{
		   padding-top:0.6rem;
		   border:2px solid #16878d;
		   border-radius:20px;
		   color:#16878d;
		   background-color: #fff;
		   .list-part-row{
			   text-align:center;
			   font-size:1rem;
		   }
		   .list-part-btn{
			   text-align:center;
			   background-color: #16878d;
			   border:2px solid #16878d;
			   border-bottom-left-radius:20px;
			   border-bottom-right-radius:20px;
			   .row-btn{
				   display:inline-block;
				   padding:0.1rem 0.4rem;
				   font-size:1.5rem;
				   height:1.8rem;
				   line-height: 1.8rem;
				   color:#fff;
			   }
		   }
	   }
   }
	
	.morning{
		color:#ffb602;
	}
	.afternoon{
		color:#b20c24;
	}
    .night{
	    color:#fcfeb5;
    }
</style>
