<template>
	<div>
        <div ref="wrapper" :style="{ height: wrapperHeight + 'px' }" style="overflow: scroll;-webkit-overflow-scrolling : touch;position:relative;">
		<group >
			<cell title="日期"  :value="queryParams.change_date"></cell>
			<cell title="时间" :value="daySpanFormat(queryParams.day_span)" ></cell>
			<cell title="科目" :value="subjectFormat(queryParams.subject)" ></cell>
			<cell title="加班价格" :value="priceFormat(queryParams.price)" ></cell>
			<cell title="申请类型" :value="worktypeFormat(queryParams.work_type)" ></cell>
			<cell title="申请时间" :value="datetimeFormat(queryParams.ask_time)" ></cell>
			<cell title="申请原因" :value="queryParams.ask_remark" ></cell>
			<cell title="审批人" :value="queryParams.handle_name" ></cell>
			<cell :value-align="alignValue" title="审批备注" :value="queryParams.handle_remark" ></cell>
			<cell title="审批时间" :value="datetimeFormat(queryParams.handle_time)" ></cell>
			<cell title="审批状态" :value="askstatusFormat(queryParams.ask_status)" ></cell>
		</group>
        
		<div v-if="queryParams.ask_status==1" style="padding:1rem 1rem">
			<x-button type="primary"  @click.native="cancelAsk">取消申请</x-button>
		</div>
        </div>
		<alert v-model="alertShow" title="提示" :content="alertContent"></alert>
	</div>
	
</template>

<script>
    import { Group,Cell,XButton,CellBox, XInput,Alert} from 'vux'
    import { mapState, mapActions } from 'vuex'
	import {cancelExamineAsk} from './../getData/getData'
    export default {
        components: {
            Cell,
            Group,
            XButton,
            XInput,
			Alert,
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
			//取消申请
            async cancelAsk(){
			    let params={id:this.queryParams.id};
                let result= await cancelExamineAsk(params,this.adminInfo.cookie_value);
                if (result.success){
                    this.alertContent='取消成功';
                    this.alertShow=true;
                    this.queryParams.ask_status=2;
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
         this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top+30;
        },
        activated(){
            this.updateTabIndex(0);//用于留住tabIndex
            this.queryParams= this.$route.query.item;
            console.log(this.queryParams)
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
                alignValue:'left'
            }
        }
    }
</script>

<style lang="less" scoped>
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
	.pwd-dialog{
		width:100%;
	}
</style>
