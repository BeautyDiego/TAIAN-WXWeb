<template>
	<div>
		<flexbox style="z-index:5;position:relative;top:0;">
			<flexbox-item>
				<tab >
					<tab-item @on-item-click="filterStatus(0)" selected>全部</tab-item>
					<tab-item @on-item-click="filterStatus(1)" >待培训</tab-item>
					<tab-item @on-item-click="filterStatus(5)" >已付款</tab-item>
					<tab-item @on-item-click="filterStatus(6)" >已完成</tab-item>
					<tab-item @on-item-click="filterStatus(2)" >已取消</tab-item>
				</tab>
			</flexbox-item>
			<div class="date-search-btn" @click="dateSearchPaneToggle">
				<div >
					<span  class="demo-icon" style="font-size:1.6rem;">&#xe64a;</span>
				</div>
			
			</div>
		</flexbox>
		<transition name="fade">      //fade 名字是可以更换的
			<div class="date-search-pane" v-show="showDateSearchPane" >
				<div>
					<calendar title="开始时间" v-model="searchHisForm.start" placeholder="请点击选择"  >
					</calendar>
				</div>
				<div>
					<calendar title="结束时间" :start-date="searchHisForm.start" v-model="searchHisForm.end"  placeholder="请点击选择"  >
					</calendar>
				</div>
				<div>
					<div class="date-search-cancel"  @click="cancelSearch">取消</div>
					<div class="date-search-comfirm" @click="confirmSearch">确定</div>
				</div>
			</div>
		</transition>
		
		<div ref="wrapper" :style="{ height: wrapperHeight + 'px' }" style="overflow: scroll;-webkit-overflow-scrolling : touch;">
			<group  v-infinite-scroll="loadMore"
					infinite-scroll-disabled="scrollDisabled"
					infinite-scroll-distance="10">
				<cell-box style="flex-direction: column;margin-bottom:0.5rem;"
						  v-for="(item,index) in reservationList" :key="index" >
					<flexbox orient="vertical" >
						<flexbox-item >
							<flexbox orient="vertical">
								<flexbox-item >
									<flexbox>
										<flexbox-item >
											{{item.ShortName}}
										</flexbox-item>
										<div :class="orderStatusClass(item.OrderStatus)">
											{{orderStatusFormat(item.OrderStatus)}}
										</div>
									</flexbox>
								</flexbox-item>
							</flexbox>
						</flexbox-item>
						<flexbox-item style="border-top:1px solid #d9d9d9;color:#666;padding:1rem 0">
							<flexbox >
								<flexbox-item :span="1/5" >
									<div class="stu-sculpture">
										<img :src="item.Photo?item.Photo:'./../../../static/img/nophoto.png'" :onerror="NOPHOTO"  class="weui-media-box__thumb"  >
									</div>
								</flexbox-item>
								<flexbox-item >
									<flexbox orient="vertical">
										<flexbox-item >
											{{item.StuName}} <a :href="'tel:'+item.StuPhone">{{item.StuPhone}}</a>
										</flexbox-item>
										<flexbox-item style="font-size:1rem;">
											预约时间:{{item.PlanDate+' '+item.StartSpan+'-'+item.EndSpan}}
										</flexbox-item>
										<flexbox-item style="font-size:1rem;">
											下单时间:{{item.Joindate}}
										</flexbox-item>
									</flexbox>
								</flexbox-item>
								<flexbox-item :span="1/6" >
									<div >
										￥{{item.TradeCash}}
									</div>
								</flexbox-item>
							</flexbox>
						</flexbox-item>
						<!--1代表是待培训-->
						<flexbox-item v-if="canHandleOrder(item.OrderStatus,item.PlanDate,item.EndSpan)">
							<div>
								<div style="padding:2px 20px;font-size:1rem;width:4rem;border:1px solid #458B00;color:#458B00;float:right;"
									 @click.stop="onOrderHandle(1,item.OrderNum)">完成培训</div>
								
								<div style="padding:2px 20px;font-size:1rem;width:3rem;border:1px solid #e4393c;color:#e4393c;float:right;margin-right:10px;"
									 @click.stop="onOrderHandle(2,item.OrderNum)">未培训</div>
							</div>
						</flexbox-item>
					</flexbox>
				
				</cell-box>
			</group>
			<load-more :show-loading="showloading"  :tip="loadingtxt" ></load-more>
		</div>
		
	</div>
</template>

<script>
    import { Tab, TabItem,Group, CellBox,Flexbox, FlexboxItem,Popup,XInput,Calendar,LoadMore,Popover} from 'vux'
	import {reservationDetail,setPrebook} from './../getData/getData'
    import { mapState, mapActions } from 'vuex'
    export default {
        components: {
            Tab, TabItem,
            Group,
			CellBox,
            Flexbox,
			FlexboxItem,
            Popup,
            XInput,
            Calendar,
            LoadMore,
            Popover,
        },
        methods: {
            async loadReservationList(){
                this.showloading=true;
                this.loadingtxt='正在加载'
                let params=this.searchHisForm;
                let res=await reservationDetail(params,this.adminInfo.cookie_value)
                if (res.success){
                    if (res.result.length>0){
                        for (let i=0; i < res.result.length; i++) {
                            this.reservationList.push( res.result[i] );
                        }
                        if (res.result.length<5){
                            this.showloading=false;
                            this.loadingtxt='无更多数据';
							this.scrollDisabled=true;

                        }
                    }else{
                        this.showloading=false;
                        this.loadingtxt='无更多数据';
						this.scrollDisabled=true;
                    }

                }

            },
            loadMore() {
                this.loadReservationList();
                this.searchHisForm.page++;
            },
            dateSearchPaneToggle(){
               this.showDateSearchPane=!this.showDateSearchPane;
			},
            filterStatus(value){
                this.showDateSearchPane=false; //关闭搜索框
				this.searchHisForm.start='';
                this.searchHisForm.end='';
                this.searchHisForm.status=value;
                this.searchHisForm.page=1;
                this.reservationList=[];
                this.scrollDisabled=false;
                this.loadMore();
			},
			cancelSearch(){
                this.showDateSearchPane=false;
				this.searchHisForm.start='';
                this.searchHisForm.end='';
			},
			confirmSearch(){
                this.showDateSearchPane=false;
                this.reservationList=[];
                this.searchHisForm.page=1;
                this.scrollDisabled=false;
                this.loadMore();
			},
            orderStatusFormat(orderStatus){
                if ( orderStatus==1){
                    return '待培训'
                }else if (orderStatus==2){
                    return '已取消'
                }else if (orderStatus==3){
                    return '已培训'
                }else if (orderStatus==4){
                    return '未培训'
                }else if (orderStatus==5){
                    return '已付款'
                }else if (orderStatus==6){
                    return '已评价'
                }else{
                    return ''
                }
            },
            orderStatusClass(orderStatus){
                if ( orderStatus==1){
                    return 'order-waiting-train'
                }else if (orderStatus==2){
                    return 'order-canceled'
                }else if (orderStatus==3){
                    return 'order-trained'
                }else if (orderStatus==4){
                    return 'order-untrained'
                }else if (orderStatus==5){
                    return 'order-payed'
                }else if (orderStatus==6){
                    return 'order-evaluated'
                }else{
                    return ''
                }
            },
             onOrderHandle(status,orderNum){
                const cookieValue=this.adminInfo.cookie_value;
                let ContentValue="确认完成培训";
                if (status ===2){
                    ContentValue="确认未完成培训";
				 }
				 const me=this;
                this.$vux.confirm.show({
                    title: '确认',
                    content: ContentValue,
                    onCancel () {
                    },
                    async onConfirm () {
                        const params={status:status,order_num:orderNum};
                        let res=await setPrebook(params,cookieValue);
                        if (res.success){
                            me.$vux.toast.show({
                                text: '成功',
                            })
                            me.searchHisForm.page=1;
                            me.reservationList=[];
                            me.loadMore();
                        }else{
                            this.$vux.toast.show({
                                type:'text',
                                width: '10rem',
                                text: res.result,
                            })
                        }
                    }
                })
               
			},
			/*判断是否可以完成培训或者未完成培训*/
			canHandleOrder(OrderStatus,PlanDate,EndSpan){
			    let flag=false;
			    let planDateTime=PlanDate+' '+EndSpan;
				if (new Date()>new Date(Date.parse(planDateTime.replace(/-/g,  "/")))&&OrderStatus==1){
                    flag =true;
				}
				return flag;
			},
            ...mapActions([
                'updateTabIndex'
            ]),

        },
		created(){
            this.$store.commit("readAdminInfo");
//			let day1 = new Date();
//            day1.setTime(day1.getTime()-24*60*60*1000);
//			let endTime = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
//			day1.setTime(day1.getTime()-24*6*60*60*1000);
//            let startTime = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
//            this.searchHisForm.start=startTime;
//            this.searchHisForm.end=endTime;
		},
        mounted () {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top-50;
        },
        activated(){
            this.updateTabIndex(1);//用于留住tabIndex
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
                searchHisForm:{
                    status:0,
                    start:'',
                    end:'',
                    page:1,
                    rows:5,
                },
                showloading:true,
				reservationList:[],
                loadingtxt:'',
                wrapperHeight: 0,
				showDateSearchPane:false,
                scrollDisabled:false,
            }
        }
    }
</script>

<style lang="less">
.date-search-btn{
	width:4rem;text-align:center;height:44px;line-height:44px;    background-color:#fff;
	>div{
		background: linear-gradient(180deg, #e5e5e5, #e5e5e5, rgba(229, 229, 229, 0)) bottom left no-repeat;  background-size: 100% 1px;    box-sizing: border-box;height:44px;
	}
}
.date-search-pane{
	background-color:#fff;
	position: absolute;
	left: 0;
	top: 44px;
	width: 100%;
	z-index:2;
	.date-search-cancel{
		height:4rem;
		line-height:4rem;
	    width:50%;
		float:left;
		text-align:center;
		background-color:#e1f5fe;
		color:#03a9f4;
		font-size:1.6rem;
	}
	.date-search-comfirm{
		height:4rem;
		line-height:4rem;
		width:50%;
		display:inline-block;
		text-align:center;
		background-color:#03a9f4;
		color:#fff;
		font-size:1.6rem;
	}
}
.stu-sculpture{
	text-align:center;
	img{
		width: 60px;
		height: 60px;
		border-radius: 50%;
	}
}
.order-waiting-train{
	color:#00838f;
}
.order-trained{
    color:#00695c;
}
.order-canceled{
	color:#424242;
}
.order-payed{
	color:#2e7d32;
}
.order-untrained{
    color:#d84315;
}
.order-evaluated{
	color:#ff8f00;
}

.fade-enter-active,.fade-leave-active {
	transition: all 500ms linear;
}
.fade-enter,.fade-leave-active {
	
	transform:translateY(-200px);
}

</style>
