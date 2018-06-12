<template>
	<div>
		<div class="plan-detial" >
			<div class='detail-header' >
					<div class="coach-sculpture" style="float:left;width:8rem;">
						<img :src="PhotoUrl?PhotoUrl:'./../../../static/img/nophoto.png'" :onerror="NOPHOTO"  alt="" class="weui-media-box__thumb" >
					</div>
					<div class="coach-text">
						<p >{{queryParams.coachName}}</p>
						<p style="color:#999 ;">{{queryParams.date}}/{{SpanFormatter(queryParams.span)}}</p>
					</div>
					<div class="book-rules" @click="ToBookRule">
						预约规则<span  class="demo-icon" style="font-size:1rem;">&#xe605;</span>
					</div>
			</div>
			<flexbox orient="vertical" v-for="(item,index) in daySpanPlanList" :key="index">
				<flexbox class="detail-main-row">
					<flexbox-item :span="1/7">
						<p style="text-align:center">
							<span  class="demo-icon" style="color:#1296db;font-size:3rem;">&#xe602;</span>
					    </p>
					</flexbox-item>
					<flexbox-item >
						<flexbox orient="vertical">
							<flexbox-item style="font-size:1.8rem;">{{item.StartSpan}}-{{item.EndSpan}}</flexbox-item>
							<flexbox-item v-if="item.SubjectId !=0">￥{{item.Price}}/小时</flexbox-item>
						</flexbox>
					</flexbox-item>
					<flexbox-item :span="1/6">
						{{subjectFormatter(item.SubjectId)}}
					</flexbox-item>
					<!--ChangePlan 0正常 1请假 2科目二加班 3科目三加班    PreBookStatus 1没预约 2被预约-->
					<div style="width:8rem;">
						<div v-if="item.PreBookStatus ==1&&item.SubjectId!=0&&item.SubjectId>adminInfo.subjext-1" style="text-align:center">
							<x-button type="primary" :mini="true"  @click.native="submiteBook(item.Id)" :disabled="item.AskStatus==1">{{PreBookNameFormatter(item.AskStatus)}}</x-button>
					    </div>
						<div v-else-if="item.PreBookStatus ==1&&item.SubjectId!=0&&item.SubjectId<adminInfo.subjext" style="text-align:center">
						
						</div>
						<!--休息-->
						<div v-else-if="item.SubjectId ==0" style="text-align:center">
							<span  class="demo-icon" style="font-size:3.5rem;margin-right:1rem;color:#f65e5e;" >&#xe6cb;</span>
						</div>
						<div v-else style="text-align:center">
							<span  class="demo-icon" style="font-size:3.5rem;margin-right:1rem;" :class="item.StudentId==adminInfo.stu_id?'mybook':'othersbook'">&#xe64b;</span>
						</div>
					</div>
				</flexbox>
			</flexbox>
			<div style="padding-bottom:4rem"></div>
			<confirm v-model="showComfirm"
					 ref="confirm5"
					 title="确认预约"
					 @on-confirm="onComfirmBook">
			</confirm>
		</div>
		
	</div>
</template>

<script>
    import { Group, CellBox, Flexbox, FlexboxItem,XButton,Confirm } from 'vux'
	import {bookCoachDetail,preBook} from './../getData/getData'
    import { mapState, mapActions } from 'vuex'
    export default {
        components: {
            CellBox,
			Group,
            Flexbox,
            FlexboxItem,
            XButton,
            Confirm,
        },
        methods: {
           async doGetDayPlanDetail(){
               this.$vux.loading.show({
                   text: '加载中'
               });
               let res= await bookCoachDetail(this.queryParams,this.adminInfo.cookie_value);
               console.log(res)
               if (res.success){
                 this.daySpanPlanList=res.result;
               }else{
                   this.$vux.toast.show({
                       type:'cancel',
                       text: res.result,
                   })
               }
               this.$vux.loading.hide()
		   },
            submiteBook(value){
                this.showComfirm=true;
               this.bookParams.id = value;
			},
			async onComfirmBook(){
                let res= await preBook(this.bookParams,this.adminInfo.cookie_value);
                console.log(res);
                if (res.success){
                    this.$vux.toast.show({
                        text: '预约成功',
                    })
                    this.doGetDayPlanDetail();
                }else{
                    this.$vux.toast.show({
                        type:'cancel',
                        text: res.result,
                        width:'16em'
                    })
                }
			},
            ToBookRule(){
                this.$router.push('/BookRule');
			},
			subjectFormatter(SubjectId){
                if (SubjectId==2){
                    return '科目二'
				}else if(SubjectId==3){
                    return '科目三'
				}else{
                    return ''
				}
			},
            SpanFormatter(span){
                if (span==0){
                    return '全天'
                }else if(span==1){
                    return '上午'
                }else if(span==2){
                    return '下午'
                }else if(span==3){
                    return '晚上'
                }else{
                    return ''
                }
			},
			PreBookNameFormatter(askstatus){
                if(askstatus==1){
                    return '请假中'
                }else{
                    return '立即预约'
                }
			},
            ...mapActions(['updateTabIndex']),
        },
		created(){
  
		},
        mounted () {
        
        },
        activated(){
            this.updateTabIndex(0);
            this.$store.commit("readAdminInfo");
            this.queryParams= this.$route.query;
            this.PhotoUrl=this.$route.query.photo;
            this.doGetDayPlanDetail();
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
				daySpanPlanList:[],
				queryParams:{},
				bookParams:{id:''},
				showComfirm:false,
                PhotoUrl:'',
            }
        }
    }
</script>

<style lang="less" scoped>
	.detail-header{
		margin-top:2rem;
		height:5rem;
		line-height:5rem;
		font-size:1.5rem;

		.coach-text{
			float:left;
			width:60%;
			font-size:1.5rem;
			height:5rem;
			p{
				height:2.5rem;
				line-height:2.5rem;
			}
		}
		.book-rules{
			float:right;
			font-size:1.1rem;
			color:  #1296db;
			height:2.5rem;
			line-height:2.5rem;
		}
	}
	.detail-main-row{
		background-color:#fff;
		padding:1rem 1rem;
		margin:0.8rem 0;
	}
	.mybook{
		color:#F43530;
	}
	.othersbook{
		color:#d9d9d9;
	}
</style>
