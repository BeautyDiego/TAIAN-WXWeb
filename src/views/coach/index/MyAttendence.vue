<template>
	<div style="height:100%">
		<tab :line-width="1" custom-bar-width="3rem">
			<tab-item @on-item-click="clickWeek('Monday')" selected>周一</tab-item>
			<tab-item @on-item-click="clickWeek('Tuesday')" >周二</tab-item>
			<tab-item @on-item-click="clickWeek('Wednesday')">周三</tab-item>
			<tab-item @on-item-click="clickWeek('Thursday')">周四</tab-item>
			<tab-item @on-item-click="clickWeek('Friday')">周五</tab-item>
			<tab-item @on-item-click="clickWeek('Saturday')">周六</tab-item>
			<tab-item @on-item-click="clickWeek('Sunday')">周日</tab-item>
		</tab>
		<div v-if="dayHour.length>0">
			<flexbox orient="vertical" style="margin-top:2rem;">
				<flexbox-item class="attendence-setting" v-if="dayHour.find((d)=>d.DaySpan==1)">
					<flexbox >
						<flexbox-item>
							<div class="time-text">上午</div>
							<div class="time-text">{{dayHour.find((d)=>d.DaySpan==1).StartHour}}:00-{{dayHour.find((d)=>d.DaySpan==1).EndHour}}:00</div>
						</flexbox-item>
						<div v-if="IsSetting" class="subject-tip shake shake-little shake-constant" >
							<div class="vux-popover-arrow vux-popover-arrow-right"></div>
							<div>
								<div style="padding:2px 4px;">
									请选择
								</div>
							</div>
						</div>
						<div class="subject " :class="subjectColor(myModule[currentWeekname][0])" @click="setAttendence(0)">{{subjectName(myModule[currentWeekname][0])}}</div>
						<div class="subject-price">{{subjectPrice(myModule[currentWeekname][0],myModule[currentWeekname][3])}}</div>
					</flexbox>
				</flexbox-item>
				
				<flexbox-item class="attendence-setting" v-if="dayHour.find((d)=>d.DaySpan==2)">
					<flexbox >
						<flexbox-item>
							<div class="time-text">下午</div>
							<div class="time-text">{{dayHour.find((d)=>d.DaySpan==2).StartHour}}:00-{{dayHour.find((d)=>d.DaySpan==2).EndHour}}:00</div>
						</flexbox-item>
						<div v-if="IsSetting" class="subject-tip shake shake-little shake-constant" >
							<div class="vux-popover-arrow vux-popover-arrow-right"></div>
							<div>
								<div style="padding:2px 4px;">
									请选择
								</div>
							</div>
						</div>
						<div class="subject" :class="subjectColor(myModule[currentWeekname][1])"  @click="setAttendence(1)">{{subjectName(myModule[currentWeekname][1])}}</div>
						<div class="subject-price">{{subjectPrice(myModule[currentWeekname][1],myModule[currentWeekname][4])}}</div>
						
					</flexbox>
				</flexbox-item>
				
				<flexbox-item class="attendence-setting" v-if="dayHour.find((d)=>d.DaySpan==3)">
					<flexbox >
						<flexbox-item>
							<div class="time-text">晚上</div>
							<div class="time-text">{{dayHour.find((d)=>d.DaySpan==3).StartHour}}:00-{{dayHour.find((d)=>d.DaySpan==3).EndHour}}:00</div>
						</flexbox-item>
						<div v-if="IsSetting" class="subject-tip shake shake-little shake-constant" >
							<div class="vux-popover-arrow vux-popover-arrow-right"></div>
							<div>
								<div style="padding:2px 4px;">
									请选择
								</div>
							</div>
						</div>
						<div class="subject" :class="subjectColor(myModule[currentWeekname][2])"  @click="setAttendence(2)">{{subjectName(myModule[currentWeekname][2])}}</div>
						<div class="subject-price">{{subjectPrice(myModule[currentWeekname][2],myModule[currentWeekname][5])}}</div>
					</flexbox>
				</flexbox-item>
				
			</flexbox>
		</div>
		<div style="margin:0 1rem">
			<flexbox :gutter=40>
				<flexbox-item>
					<x-button type="primary" style="margin-top:1rem;font-size:1.3rem;" :disabled="IsSetting" @click.native="releaseMonthplan(0)">发布本月计划</x-button>
				</flexbox-item>
				<flexbox-item>
					<x-button type="primary" style="margin-top:1rem;font-size:1.3rem;" :disabled="IsSetting" @click.native="releaseMonthplan(1)">发布下月计划</x-button>
				</flexbox-item>
			</flexbox>
		</div>
		<div style="position:fixed;bottom:5rem;width:100%;">
			<div v-if="!IsSetting" style="margin:1rem">
				<x-button type="primary" style="margin-top:1rem;background-color: #3ebcca" @click.native="startSetting">开始设置</x-button>
			</div>
			<div v-else>
				<div>
					<p style="text-align:center">点击右侧圆圈可以设置考勤状态，分别为休息、科目二、科目三</p>
				</div>
				<div style="margin:1rem">
					<flexbox :gutter="40">
						<flexbox-item>
							<x-button type="primary" style="background-color: #5fce45" @click.native="submiteSetting">确定提交</x-button>
						</flexbox-item>
						<flexbox-item>
							<x-button type="primary" style="background-color: #e95959" @click.native="cancleSetting">取消设置</x-button>
						</flexbox-item>
					</flexbox>
				</div>
			</div>
		
		</div>
		
		<div v-transfer-dom>
			<popup v-model="showPopup">
				<!-- group already has a top border, so we need to hide header's bottom border-->
				<popup-header
						left-text="取消"
						right-text="确定"
						title="请设置"
						:show-bottom-border="false"
						@on-click-left="showPopup = false"
						@on-click-right="comfirmRadio"></popup-header>
				<group :gutter=0>
					<x-input v-if="radioValue!=0" title="￥" v-model="inputValue" placeholder="请输入培训金额" :disabled="radioValue==0"></x-input>
					<radio :options="subjectOptions" v-model="radioValue"></radio>
				</group>
			</popup>
		</div>
	</div>
</template>

<script>
 
    import { Tab, TabItem, PopupHeader, Popup, TransferDom, Radio,Group,Flexbox, FlexboxItem,Popover,ButtonTab,ButtonTabItem,XButton,XInput} from 'vux'
    import { mapState,mapActions } from 'vuex'
	import {getDayHour,myattendence,setattendence,releaseMonthPlan} from './../getData/getData'
    export default {
        directives: {
            TransferDom
        },
        components: {
            Tab,
            TabItem,
            PopupHeader,
            Popup,
            Radio,
            Group,
			Flexbox,
			FlexboxItem,
            Popover,
            ButtonTab,
			ButtonTabItem,
            XButton,
            XInput
        },
        methods: {
            /**
			 * @获取该驾校设置的培训时间
			 * **/
            async getDayHour(){
                let res= await getDayHour({},this.adminInfo.cookie_value);
                console.log(res);
                if (res.success){
                   this.dayHour=res.result;
                }else{
                    this.$vux.alert.show({
                        title: '警告',
                        content: res.result,
						width:'12rem'
                    })
				}
            },
            /**
             * @获取教练设置好的考勤模版
             * **/
            async getMyModule(){
              let res= await myattendence({},this.adminInfo.cookie_value);
              console.log(res);
              if (res.success){
                  this.paramsId=res.result.Id;
                  if (res.result.Monday){
                      for (let week in this.myModule)
                      {
                          this.myModule[week]=res.result[week].split(',');
                      }
				  }else{
                      this.myModule=JSON.parse(JSON.stringify(this.resetMyModule))
				  }
			  }
			},
            clickWeek(weekname){
               this.currentWeekname=weekname;
			},
            setAttendence(index){
                if (this.IsSetting){
                    this.showPopup=true;
                    this.selectIndex=index;
                    this.radioValue=this.myModule[this.currentWeekname][index];
                    this.inputValue=this.myModule[this.currentWeekname][index+3];
				}else{
    
				}
    
			},
            startSetting(){
               this.IsSetting=true;
			},
            async submiteSetting(){
                this.$vux.loading.show({
                    text: '加载中'
                });
                let flag=true;
                let tempModule=Object.assign({},this.myModule);
                let params={};
                //获取此驾校的每日模版
                let dayhour=this.dayHour;
                console.log(tempModule);
                for (let week in tempModule)
                {
                    tempModule[week].forEach((value,index)=>{
                        if (!value&&index<3&&dayhour.find((d) =>d.DaySpan==index+1)){ //看驾校模版是早中晚哪几个  然后再做验证
                            flag=false;
                            return
						}
					});
                    let tempArr=tempModule[week].slice(0);
                    params[week]=tempArr.join(',');
                }
                if (flag){
                    this.$vux.loading.hide()
                    params.Id=this.paramsId;
                    let res= await setattendence(params,this.adminInfo.cookie_value);
                    if (res.success){
                        this.$vux.toast.show({
                            text: '提交成功',
                        })
						this.IsSetting=false;
					}else{
                        this.$vux.alert.show({
                            title: '警告',
                            content: res.result,
                        })
					}
				}else{
                    this.$vux.loading.hide()
                    this.$vux.alert.show({
                        title: '警告',
                        content: '每个时间段都需要设置好',
                    })
				}
                
			},
            cancleSetting(){
                let me=this;
                this.$vux.confirm.show({
                    title: '提示',
                    content: '确认取消设置',
                    onCancel () {

                    },
                    async onConfirm () {
                        me.IsSetting=false;
                        me.getMyModule();
                    }
                })
               
			},
			releaseMonthplan(value){
				const me=this;
                this.$vux.confirm.show({
                    title: '提示',
                    content: '发布以后请到月度计划修改,不可重复发布',
                    onCancel () {

                    },
                    async onConfirm () {
                        me.$vux.loading.show({
                            text: '加载中'
                        });
                        let res= await releaseMonthPlan({month:value},me.adminInfo.cookie_value);
                        if (res.success){
                            me.$vux.loading.hide()
                            me.$vux.toast.show({
                                text: '发布成功',
                            })
                        }else{
                            me.$vux.loading.hide()
                            me.$vux.toast.show({
                                text: res.result,
                                width:'18em',
                                type:'cancel'
                            })
                        }
                    }
                })
			},
			comfirmRadio(){  //确认radio的选择
				if (this.radioValue){
					if (this.inputValue>0){
					    if(parseInt(this.inputValue)<1000&&parseInt(this.inputValue)>0){
                            this.showPopup = false;
                            this.myModule[this.currentWeekname][this.selectIndex]=this.radioValue;
                            this.myModule[this.currentWeekname][this.selectIndex+3]=parseInt(this.inputValue);
						}else{
                            this.$vux.toast.show({
                                type:'text',
                                text: '培训费需小于￥999大于￥0的整数',
                                width:'22rem'
                            })
						}
      
      
					}else{
					    if (this.radioValue==0){ //休息
                            this.showPopup = false;
                            this.myModule[this.currentWeekname][this.selectIndex]=this.radioValue;
                            this.myModule[this.currentWeekname][this.selectIndex+3]=0;
						}else{
                            this.$vux.toast.show({
								type:'text',
                                text: '培训费必须大于￥0',
								width:'14rem'
                            })
						}
					}
				}else{
                    this.$vux.toast.show({
                        type:'text',
                        text: '请选择设置',
                    })
				}
			},
            subjectColor(value){
                if (!value){
                    return ''
                } else if (value ==2){
                    return 'subject-two'
                }else if (value ==3){
                    return 'subject-three'
                }else if (value ==0){
                    return 'subject-rest'
                }else{
                    return ''
                }
            },
            subjectName(value){
                if (!value){
                    return '未设置'
				} else if (value ==2){
                    return '科目二'
                }else if (value ==3){
                    return '科目三'
                }else if (value ==0){
                    return '休息'
                }else{
                    return ''
                }
            },
            subjectPrice(subjectId,price){
                if (!subjectId){
                    return ''
                } else if (subjectId ==2){
                    return '￥'+price+'/小时'
                }else if (subjectId ==3){
                    return '￥'+price+'/小时'
                }else if (subjectId ==0){
                    return ''
                }else{
                    return ''
                }
			},
            ...mapActions([
                'updateTabIndex'
            ]),
        },
		created (){
            this.$store.commit("readAdminInfo");
		},
        mounted () {
		    this.getDayHour();
            this.getMyModule();
        },
        activated(){
            this.updateTabIndex(0);//用于留住tabIndex
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
                showPopup:false,
				IsSetting:false,
				paramsId:'',
				dayHour:[],
                resetMyModule:{
                    Monday:['','','','','',''],
                    Tuesday:['','','','','',''],
                    Wednesday:['','','','','',''],
                    Thursday:['','','','','',''],
                    Friday:['','','','','',''],
                    Saturday:['','','','','',''],
                    Sunday:['','','','','',''],
                },
				myModule:{
                    Monday:['','','','','',''],
					Tuesday:['','','','','',''],
					Wednesday:['','','','','',''],
					Thursday:['','','','','',''],
					Friday:['','','','','',''],
					Saturday:['','','','','',''],
					Sunday:['','','','','',''],
                },
				currentWeekname:'Monday',
				subjectOptions:[{
                    key: '2',
                    value: '科目二'
                },{
                    key: '3',
                    value: '科目三'
                },{
                    key: '0',
                    value: '休息'
                }],
				radioValue:'',
				selectIndex:'',//选择科目的时候 是选择的第几个
                inputValue:0,
            }
        }
    }
</script>
<style lang="less">
	@import url(./../../../assets/css/csshake-little.min.css);
	.attendence-setting{
		margin-bottom:1rem;
		background-color: #3ebcca;
		padding:0.5rem 0;
		color:#fff;
		position:relative;
		.time-text{
			width:12rem;
			text-align:center;
			font-size:1.5rem;
		}
		.subject{
			width:4rem;
			height:4rem;
			line-height:4rem;
			border-radius:2rem;
			background-color:#7E7F80;
			text-align:center;
			margin-right:1rem;
			position:relative;
		}
		.subject-price{
			width:6rem;
			height:4rem;
			line-height:4rem;
			text-align:center;
			margin-right:1rem;
			position:relative;
		}
		.subject-two{
			background-color:#ff7742;
		}
		.subject-three{
			background-color:#ffcc42;
		}
		.subject-rest{
			background-color:#ff4b42;
		}
	}
	
	.subject-tip{
		position: absolute;
		background-color: #35495e;
		color: #fff;
		border-radius: 3px;
		z-index: 500;
		top: 1.3rem; right: 13rem;
	}
</style>
