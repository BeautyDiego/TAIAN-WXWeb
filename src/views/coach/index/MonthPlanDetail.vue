<template>
	<div>
		<div class="plan-detial">
			<div class='detail-header' >
				<span  class="demo-icon" style="color:#09BB07;font-size:2rem;margin-right:1rem;font-weight:200">&#xe670;</span>{{queryParams.day}} {{dayspanFomatter(queryParams.dayspan)}}
			</div>
			<flexbox orient="vertical" v-for="(item,index) in daySpanPlanList" :key="index">
				<flexbox class="detail-main-row">
					<flexbox-item ><div style="padding-left:1rem;font-size:2rem;">{{item.start_span}}-{{item.end_span}}</div></flexbox-item>
					<div v-if="item.status ==1 " style="height:58px;line-height:58px;width:94px;text-align:center;font-size:12px;margin-right:10px;">
						未预约
					</div>
					<div v-if="item.status ==2 " style="height:58px;width:94px;margin-right:10px;">
						<flexbox orient="vertical"  >
							<div style="text-align:center;padding:5px 10px;font-size:12px;">{{item.stu_name}}</div>
							<div style="text-align:center;padding:5px 10px;font-size:12px;"><a :href="'tel:'+item.stu_phone">{{item.stu_phone}}</a></div>
						</flexbox>
					</div>
					<div v-if="JudgeTime(item.status,item.end_span)" style="position:relative">
						<span  class="demo-icon" style="color:#09BB07;font-size:2.6rem;position: absolute; right: 10px;top: -34px;">&#xe684;</span>
					</div>
					<div v-else-if="item.status==2" style="position:relative">
						<span  class="demo-icon" style="color:#e4393c;font-size:2.6rem;position: absolute; right: 10px;top: -34px;">&#xe6af;</span>
					</div>
				</flexbox>
			
			</flexbox>
		</div>
		
	</div>
</template>

<script>
    import { Group, CellBox, Flexbox, FlexboxItem} from 'vux'
	import {getDayPlanDetail} from './../getData/getData'
    import { mapState, mapActions } from 'vuex'
    export default {
        components: {
            CellBox,
			Group,
            Flexbox,
            FlexboxItem,
        },
        methods: {
           async doGetDayPlanDetail(){
               this.$vux.loading.show({
                   text: '加载中'
               });
               let res= await getDayPlanDetail(this.queryParams,this.adminInfo.cookie_value);
               function compareDown(propertyName) { // 升序排序
                  {
                       return function(object1, object2) { // 属性值为数字
                           var value1 = parseInt(object1[propertyName]);
                           var value2 = parseInt(object2[propertyName]);
                           return value1 - value2;
                       }
                   }
               }
               if (res.success){
                 this.daySpanPlanList=res.result.sort(compareDown('start_span'))
               }else{
                   this.$vux.toast.show({
                       type:'cancel',
                       text: res.result,
                   })
               }
               this.$vux.loading.hide()
		   },
			dayspanFomatter(dayspan){
               if (dayspan==1){
                   return '上午';
			   }else if (dayspan==2){
                   return '下午';
			   }else if (dayspan==3){
			       return '晚上';
			   }else{
			       return '';
			   }
			},
			/**
			 * @判断当前时间是否已经超过了预约时间
			 * */
            JudgeTime(status,endSpan){
			 if(status==2){
			    if(new Date()>new Date( this.queryParams.day.replace(/-/g,"/"))){
			        if (new Date().getHours()>parseInt(endSpan))
					{
					    return true;
					}
			    }
			 }
			   return false;
			},
            ...mapActions([
                'updateTabIndex'
            ]),
        },
		created(){
           this.curHour=new Date().getHours(); //获取当前小时
		},
        mounted () {
        
        },
        activated(){
            this.updateTabIndex(0);//用于留住tabIndex
            this.$store.commit("readAdminInfo");
            this.queryParams= this.$route.query;
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
				curHour:'',
            }
        }
    }
</script>

<style lang="less" scoped>
	.detail-header{
		margin-top:1rem;
		height:3rem;
		line-height:3rem;
		font-size:1.8rem;
		font-weight: bold;
	}
	.detail-main-row{
		background-color:#fff;
		padding:0 1rem;
		margin:0.8rem 0;
		
	}
</style>
