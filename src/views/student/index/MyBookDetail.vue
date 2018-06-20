<template>
	<div style="height:100%">
		<flexbox style="z-index:5;position:relative;top:0;">
			<flexbox-item>
				<tab custom-bar-width="4rem" scroll-threshold="5">
					<tab-item @on-item-click="filterStatus(0)" selected>全部</tab-item>
					<tab-item @on-item-click="filterStatus(1)" >待培训</tab-item>
					<tab-item @on-item-click="filterStatus(4)" >未培训</tab-item>
					<tab-item @on-item-click="filterStatus(3)">待支付</tab-item>
					<tab-item @on-item-click="filterStatus(5)">已支付</tab-item>
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
					<calendar title="开始时间" v-model="searchCoachForm.start" placeholder="请点击选择" >
					</calendar>
				</div>
				<div>
					<calendar title="结束时间" :start-date="searchCoachForm.start" v-model="searchCoachForm.end"  placeholder="请点击选择" >
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
					infinite-scroll-disabled="loading"
					infinite-scroll-distance="50">
				<cell-box style="flex-direction: column;"
						  :is-link="true"
						  :link="{path: 'prebookdetail', query: {order_num:item.OrderNum}}"
						  v-for="(item,index) in myPreBookList" :key="index">
					<flexbox orient="vertical" >
						<flexbox-item >
							<flexbox orient="vertical">
								<flexbox-item >
									<flexbox>
										<flexbox-item >
											{{item.ShortName}}
										</flexbox-item>
										<div >
											{{orderStatusFormat(item.OrderStatus)}}
										</div>
									</flexbox>
								</flexbox-item>
							</flexbox>
						</flexbox-item>
						<flexbox-item style="border-top:1px solid #d9d9d9;border-bottom:1px solid #d9d9d9;color:#666;padding:1rem 0">
							<flexbox >
								<flexbox-item :span="1/5" >
									<div class="coach-sculpture">
										<img :src=" item.Photo?item.Photo:'./../../../static/img/nophoto.png'" :onerror="NOPHOTO"  alt="" class="weui-media-box__thumb" >
									</div>
								</flexbox-item>
								<flexbox-item >
									<flexbox orient="vertical">
										<flexbox-item >
											{{item.CoachName}}
										</flexbox-item>
										<flexbox-item style="font-size:1rem;">
											预约时间:{{item.PlanDate+' '+item.StartSpan+'-'+item.EndSpan}}
										</flexbox-item>
										<flexbox-item style="font-size:1rem;">
											下单时间:{{item.Joindate}}
										</flexbox-item>
									</flexbox>
								</flexbox-item>
								<flexbox-item :span="1/5" >
									<div >
										￥{{item.TradeCash}}
									</div>
								</flexbox-item>
							</flexbox>
						</flexbox-item>
						<flexbox-item >
							<flexbox orient="vertical">
								<flexbox-item >
									<flexbox>
										<flexbox-item >
										
										</flexbox-item>
										<div >
											<div style="height:1.5rem;padding:0 8px;font-size:1rem;"
												 :class="orderHandleClass(item.OrderStatus)"
											     @click.stop="onOrderHandle(item.OrderStatus,item.OrderNum,item.TradeCash)">{{orderHandleName(item.OrderStatus)}}</div>
										</div>
									</flexbox>
								</flexbox-item>
							</flexbox>
						</flexbox-item>
					</flexbox>
				</cell-box>
			</group>
			<load-more :show-loading="showloading"  :tip="loadingtxt"></load-more>
			<div style="padding-bottom:4rem"></div>
			
			<confirm v-model="showComfirm"
					 title="确认取消"
					 theme="ios"
					 showInput
					 placeholder="请填写取消原因"
					 @on-confirm="onCancelConfirm">
			</confirm>
			
			<div v-transfer-dom>
				<popup v-model="showRating" >
					<group title="评价教练">
						<cell title="培训环境">
							<rater v-model="evaluateForm.score1" ></rater>
						</cell>
						<cell title="教学水平">
							<rater v-model="evaluateForm.score2"  ></rater>
						</cell>
						<cell title="服务态度">
							<rater v-model="evaluateForm.score3" ></rater>
						</cell>
						<cell title="教学安全">
							<rater v-model="evaluateForm.score4" ></rater>
						</cell>
						<x-textarea :max="20" placeholder="填写评价" v-model="evaluateForm.details" ></x-textarea>
					</group>
					
					<div style="padding: 15px;">
						<x-button :show-loading="evaluteBtnLoading"  type="primary" @click.native="doEvaluate"> 提交评价 </x-button>
					</div>
				</popup>
			</div>
			
		</div>
	</div>
</template>

<script>
 
    import { Tab, TabItem, PopupHeader, Popup, TransferDom, Radio,Group,Cell,Flexbox,CellBox, FlexboxItem,Popover,ButtonTab,ButtonTabItem,XButton,XInput,LoadMore,Calendar,Confirm,XTextarea,Rater} from 'vux'
    import { mapState,mapActions } from 'vuex'
	import {myPreBook,cancelPreBook,evaluateOrder,getUnified} from './../getData/getData'
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
            XInput,
            LoadMore,
            CellBox,
            Calendar,
			Confirm,
            XTextarea,
            Cell,
            Rater,
        },
        methods: {
            async loadCoachList(){
                this.loading=true;
                this.showloading=true;
                this.loadingtxt='正在加载'
                let params=this.searchCoachForm;
                let res=await myPreBook(params,this.adminInfo.cookie_value)
                console.log(res);
                if (res.success){
                    if (res.result.length>0){
                        for (let i=0; i < res.result.length; i++) {
                            this.myPreBookList.push( res.result[i] );
                        }
                        if (res.result.length<5){
                            this.showloading=false;
                            this.loadingtxt='无更多数据'
                        }else{
                            this.loading=false;
						}
                    }else{
                        this.showloading=false;
                        this.loadingtxt='无更多数据'
                    }

                }

            },
            loadMore() {
                this.searchCoachForm.page++;
                this.loadCoachList();
            },
            filterStatus(value){
                this.showDateSearchPane=false; //关闭搜索框
                this.searchCoachForm.start='';
                this.searchCoachForm.end='';
               this.searchCoachForm.status=value;
               this.searchCoachForm.page=1;
                this.myPreBookList=[];
                this.loadCoachList();
			},
            dateSearchPaneToggle(){
                this.showDateSearchPane=!this.showDateSearchPane;
            },cancelSearch(){
                this.showDateSearchPane=false;
                this.searchCoachForm.start='';
                this.searchCoachForm.end='';
            },
            confirmSearch(){
                this.showDateSearchPane=false;
                this.myPreBookList=[];
                this.searchCoachForm.page=1;
                this.loadMore();
            },
			async onOrderHandle(orderStatus,orderNum,TradeCash){
                if ( orderStatus==1){ //待培训
                    this.currentOrderNum=orderNum;
                    this.showComfirm=true;
                }else if (orderStatus==2){
                    return '已取消'
                }else if (orderStatus==3){ //已培训
                    let res=await getUnified({order_num:orderNum},this.adminInfo.cookie_value);
                    this.payCash=TradeCash; //支付时候的金额
                    this.weixinPay(JSON.parse(res.result));
                }else if (orderStatus==4){
                    return '未培训'
                }else if (orderStatus==5){ //已付款
                    this.evaluateForm.order_num=orderNum;
                    this.showRating=true;
                }else if (orderStatus==6){
                    return '已评价'
                }else{
                    return ''
                }
			},
            async onCancelConfirm(inputValue){//取消订单
                let res=await cancelPreBook({order_num:this.currentOrderNum,reason:inputValue},this.adminInfo.cookie_value);
                if (res.success){
                    this.$vux.toast.show({
                        text: '取消成功',
                    })
                    this.searchCoachForm.page=1;
                    this.myPreBookList=[];
                    this.loadCoachList();
				}else{
                    this.$vux.toast.show({
                        type:'text',
                        width: '15rem',
                        text: res.result,
                    })
				}
			},
			async doEvaluate(){ //评价
                this.evaluteBtnLoading=true;
                let res=await evaluateOrder(this.evaluateForm,this.adminInfo.cookie_value);
                if (res.success){
                    this.$vux.toast.show({
                        text: '评价成功',
                    })
                    this.searchCoachForm.page=1;
                    this.myPreBookList=[];
                    this.loadCoachList();
                    this.showRating=false;
                }else{
                    this.$vux.toast.show({
                        type:'text',
                        width: '15rem',
                        text: res.result,
                    })
                }
                this.evaluteBtnLoading=false;
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
                    return '待评价'
                }else if (orderStatus==6){
                    return '已完成'
                }else{
                    return ''
                }
			},
			orderHandleClass(orderStatus){
                if ( orderStatus==1){
                    return 'cancel-order'
                }else if (orderStatus==2){
                    return 'default-order'
                }else if (orderStatus==3){
                    return 'pay-order'
                }else if (orderStatus==4){
                    return 'default-order'
                }else if (orderStatus==5){
                    return 'evaluate-order'
                }else if (orderStatus==6){
                    return 'default-order'
                }else{
                    return ''
                }
            },
            orderHandleName(orderStatus){
                if ( orderStatus==1){
                    return '取消订单'
                }else if (orderStatus==2){
                    return ' '
                }else if (orderStatus==3){
                    return ' 支付 '
                }else if (orderStatus==4){
                    return '  '
                }else if (orderStatus==5){
                    return ' 评价 '
                }else if (orderStatus==6){
                    return '  '
                }else{
                    return ''
                }
            },
            /**
             * @method :微信支付方法
             * @param data
             */
            weixinPay(data){
                const vm= this;
                if (typeof WeixinJSBridge == "undefined"){//微信浏览器内置对象。参考微信官方文档
                    if( document.addEventListener ){
                        document.addEventListener('WeixinJSBridgeReady', vm.onBridgeReady(data), false);
                    }else if (document.attachEvent){
                        document.attachEvent('WeixinJSBridgeReady', vm.onBridgeReady(data));
                        document.attachEvent('onWeixinJSBridgeReady',vm.onBridgeReady(data));
                    }
                }else{
                    console.log('weixinPay:'+data);
                    vm.onBridgeReady(data);
                }
            },
            /**
             * @method 支付费用方法
             * @param data:后台返回的支付对象,(详情微信公众号支付API中H5提交支付);
             */
            onBridgeReady(data){
                const  vm = this;
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest',{
                        "appId":data.appId,     //公众号名称，由商户传入
                        "timeStamp":data.timeStamp, //时间戳，自1970年以来的秒数
                        "nonceStr":data.nonceStr, //随机串
                        "package":data.package,
                        "signType":data.signType, //微信签名方式：
                        "paySign":data.paySign //微信签名
                    },
                    function(res){
                        // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                        if(res.err_msg == "get_brand_wcpay_request:ok" ){
                            vm.$router.push({ path: 'paysuccess', query: { type: 'success',cash:vm.payCash }})
                        }else if (res.err_msg == "get_brand_wcpay_request:cancel"){
                            this.$vux.toast.show({
                                text: '取消支付',
                            })
                        }else{
                            vm.$router.push({ path: 'paysuccess', query: { type: 'fail',cash:vm.payCash }})
						}
                    }
                );
            },
			...mapActions(['updateTabIndex']),
        },
		created(){
            this.$store.commit("readAdminInfo");
		},
        mounted () {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
            
        },
        activated(){
            this.updateTabIndex(1);
            this.filterStatus(this.searchCoachForm.status);
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
                wrapperHeight:0,
                searchCoachForm:{
                    status:0,
                    name:'',
                    date:'',
                    span:'0',
					start:'',
					end:'',
                    page:1,
                    rows:5,
                },
                myPreBookList:[],
                loading:false,
                loadingtxt:'加载中',
                showloading:true,
                showDateSearchPane:false,
				currentOrderNum:'',
				showComfirm:false,
				showRating:false,
				evaluateForm:{
                    order_num:'',
                    score1:0,
                    score2:0,
                    score3:0,
                    score4:0,
					details:'',
				},
                evaluteBtnLoading:false,
                payCash:0,//支付时候的金额
            }
        }
    }
</script>
<style lang="less">
	.cancel-order{
		border:1px solid #e4393c;
		color:#e4393c;
	}
	.pay-order{
		border:1px solid #e4393c;
		color:#e4393c;
	}
	.evaluate-order{
		border:1px solid #e4393c;
		color:#e4393c;
	}
	.default-order{
		color:#d9d9d9;
	}
	
	.date-search-btn{
		width:3rem;text-align:center;height:44px;line-height:44px;    background-color:#fff;
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
	
	.fade-enter-active,.fade-leave-active {
		transition: all 500ms linear;
	}
	.fade-enter,.fade-leave-active {
		transform:translateY(-200px);
	}
</style>
