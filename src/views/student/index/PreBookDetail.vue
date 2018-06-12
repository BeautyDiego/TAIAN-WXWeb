<template>
	<div>
		<group title="订单详情">
			<cell title="订单号"  :value="orderDetails.OrderNum"></cell>
			<cell title="教练" :value="orderDetails.CoachName" ></cell>
			<cell title="所属驾校" :value="orderDetails.ShortName" ></cell>
			<cell title="预约时间" :value="orderDetails.PlanDate+' '+orderDetails.StartSpan+'-'+orderDetails.EndSpan" ></cell>
			<cell title="下单时间" :value="orderDetails.Joindate" ></cell>
			<cell title="费用" :value="'￥'+orderDetails.TradeCash" ></cell>
			<cell title="支付流水号" :value="orderDetails.TradeNum" ></cell>
			<cell title="支付类型" :value="payTypeFormatter(orderDetails.PayType)" ></cell>
			<cell title="支付时间" :value="orderDetails.PayTime" ></cell>
		</group>
	</div>
</template>

<script>
    import { Group, Cell} from 'vux'
    import { mapState, mapActions } from 'vuex'
    import { preBookDetail} from './../getData/getData'

    export default {
        components: {
            Cell,
			Group,
        },
        methods: {
          async getPreBookDetail(){
              let res=await preBookDetail( this.queryParams,this.adminInfo.cookie_value)
			  if (res.success){
                  this.orderDetails=res.result[0];
			  }else{
                  this.$vux.toast.show({
                      type:'cancel',
                      text: res.result,
                      width:'11em'
                  })
			  }
		  },
		  payTypeFormatter(PayType){
              if (PayType==1){
                  return '微信支付'
			  }else{
                  return ''
			  }
		  },
		  ...mapActions(['updateTabIndex']),
        },
		created(){
  
		},
        mounted () {

        },
        activated(){
            this.updateTabIndex(1);
            this.$store.commit("readAdminInfo");
            this.queryParams= this.$route.query;
            this.getPreBookDetail();
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
				orderDetails:{
                    DeName:'广东立腾',
					Name:'我是大哥',
					CoachName:'大神教练',
                    Subject:'科目二',
					NickName:'Bruce',
                    IdCard:'42011116610241251',
					Phone:'18624447751'
				},
                queryParams:{}
            }
        }
    }
</script>

<style lang="less">
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
