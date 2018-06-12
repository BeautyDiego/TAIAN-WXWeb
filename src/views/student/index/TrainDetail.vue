<template>
	<div ref="wrapper" :style="{ height: wrapperHeight + 'px' }" style="overflow: scroll;-webkit-overflow-scrolling : touch;">
			<div class="trainsubject-title"><span  class="demo-icon" style="margin-right:0.5rem;font-size:2.4rem;" v-html="subjectIconFormatter(subjectText)"></span>&nbsp<span>科目{{subjectText}}</span></div>
			<div v-for="(item,index) in trainDetailList" :key="index" style="margin:1rem 1.2rem;border-top: 1px solid #F1F1F1;  border-bottom: 1px solid #F1F1F1;background-color: #fff">
				<flexbox orient="vertical" >
					<flexbox>
						<flexbox-item :span="1/7" class="flex-div" >
							<span  class="demo-icon" style="font-size:3rem;color:#5BC2F5;margin-left:0.7rem">&#xe600;</span>
						</flexbox-item>
						<flexbox-item class="flex-div">
							<flexbox orient="vertical">
								<flexbox>
									<flexbox-item class="flex-div" :span="3/5"><div >审核学时:<span style="color:#666;"> {{item.CheckMinute}}</span> </div></flexbox-item>
									<flexbox-item class="flex-div"><div >教练:<span style="color:#666;">{{item.Name}}</span>  </div></flexbox-item>
								</flexbox>
								<flexbox>
									<flexbox-item class="flex-div" :span="3/5"><div >学习时长: <span style="color:#666;"> {{item.StudyMinute}}</span> </div></flexbox-item>
									<flexbox-item class="flex-div"><div >车辆: <span style="color:#666;"> {{item.LicNum}}</span>  </div></flexbox-item>
								</flexbox>
								<flexbox>
									<div >学习里程:<span style="color:#666;">  {{item.Mileage}}km</span> </div>
								</flexbox>
							</flexbox>
						</flexbox-item>
					</flexbox >
					<flexbox>
						<flexbox-item class="flex-div"><div class="detail-small-font" style="padding-left:0.5rem"><span  class="demo-icon detail-small-font" style="margin:0 0.2rem">&#xe60e;</span>  {{item.StartTime}} </div></flexbox-item>
						<flexbox-item class="flex-div"><div class="detail-small-font" style="padding-left:0.5rem"><span  class="demo-icon detail-small-font" style="margin:0 0.3rem">&#xe60f;</span>   {{item.EndTime}} </div></flexbox-item>
					</flexbox>
				</flexbox>
			</div>
			<load-more :show-loading="showloading"  :tip="loadingtxt"></load-more>
		    <div style="padding-top:3.5rem;"></div>
	</div>
</template>

<script>

    import { Group, CellBox, Flexbox, FlexboxItem,LoadMore} from 'vux'
    import { mapState, mapActions } from 'vuex'
	import {trainDetail} from './../getData/getData'
    export default {
        components: {
            CellBox,
			Group,
            Flexbox,
            FlexboxItem,
            LoadMore
        },
        methods: {
            async getTrainDetail(){
                this.showloading=true;
              let res= await trainDetail({sub_part:this.sub_part},this.adminInfo.cookie_value);
              if (res.success){
                  this.trainDetailList=res.result;
                  if (this.trainDetailList.length ===0 ){
                     this.loadingtxt='暂无数据'
				  }else{
				     this.loadingtxt='无更多数据'
                  }
			  }
                this.showloading=false;
			},
			subjectIconFormatter(subjectText){
                if (subjectText=='一'){
                    return '&#xe631;'
				}else if (subjectText=='二'){
                    return '&#xe613;'
				}else if (subjectText=='三'){
                    return '&#xe614;'
                }else if (subjectText=='四'){
                    return '&#xe61d;'
                }
			},
            ...mapActions([
                'updateTabIndex'
            ]),
        },
        ready(){
        },
		created(){
            this.$store.commit("readAdminInfo");
           
		},
        mounted () {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        },
        activated(){
            this.updateTabIndex(2);//用于留住tabIndex
            this.sub_part= this.$route.params.subject;
            this.getTrainDetail();
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
                trainDetailList:[],
                searchStuName: '',
                sub_part:'1',
                wrapperHeight:0,
                showloading:false,
                loadingtxt:'',
            }
        }
    }
</script>

<style lang="less">
   .detail-small-font{
	   font-size:1rem;
	   color:#8f8f94;
   }
   .flex-div{
	   font-size:1.2rem;
   }
   .blue-small-font{
	color:#5BC2F5;
   }
	.trainsubject-title{
		font-size:2rem;
		padding:1rem;
		margin-bottom:-0.8rem;
		text-align: center;
		line-height:2.4rem;
		vertical-align: middle;
	}
</style>
