<template>
	<div>
		<flexbox style="z-index:5;position:relative;top:0;">
			<flexbox-item>
				<tab >
					<tab-item @on-item-click="filterStatus(1)" selected>已发起</tab-item>
					<tab-item @on-item-click="filterStatus(4)" >已通过</tab-item>
					<tab-item @on-item-click="filterStatus(3)" >已驳回</tab-item>
				</tab>
			</flexbox-item>
		</flexbox>
		<div ref="wrapper" :style="{ height: wrapperHeight + 'px' }" style="overflow: scroll;-webkit-overflow-scrolling:touch;color:#4a4a4a;">
			<group  v-infinite-scroll="loadMore"
					infinite-scroll-disabled="scrollDisabled"
					infinite-scroll-distance="10">
				<cell-box style="flex-direction: column;margin-bottom:0.5rem;"
						  v-for="(item,index) in examineList" :key="index"  :is-link="true"
						  :link="{path: 'workexaminedetail', query: {item}}">
					<flexbox orient="horizontal" >
						<flexbox-item >
							<flexbox orient="vertical">
								<flexbox-item >
									<flexbox>
										<flexbox-item >
											{{item.change_date}}{{daySpanFormat(item.day_span)}}
										</flexbox-item>

									</flexbox>
								</flexbox-item>
								<flexbox-item >
									<flexbox>
										<flexbox-item >
											<span :style="{color:item.work_type==1?'#E64340':'#04BE02'}">{{workTypeFormat(item.work_type)}}</span>
										</flexbox-item>
									</flexbox>
								</flexbox-item>
							</flexbox>
						</flexbox-item>
						<flexbox-item >
							<flexbox>
								<span v-if="item.ask_status==1" class="demo-icon-22" style="font-size: 42px" >&#xe657;</span>
								<span v-else-if="item.ask_status==4" class="demo-icon-22" style="font-size: 32px" >&#xe601;</span>
								<span v-else-if="item.ask_status==3" class="demo-icon-22" style="font-size: 42px"  >&#xe729;</span>
							</flexbox>
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
    import { mapState, mapActions } from 'vuex'
	import {changeHistory} from './../getData/getData'
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
            async loadExamineList(){
                this.showloading=true;
                this.loadingtxt='正在加载'
                let params=this.searchExamineForm;
                let res=await changeHistory(params,this.adminInfo.cookie_value)
                if (res.success){
                    if (res.result.length>0){
                        for (let i=0; i < res.result.length; i++) {
                            this.examineList.push( res.result[i] );
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
                this.loadExamineList();
                this.searchExamineForm.page++;
            },
            filterStatus(value){
                this.searchExamineForm.status=value;
                this.searchExamineForm.page=1;
                this.examineList=[];
                this.scrollDisabled=false;
                this.loadMore();
            },
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
            workTypeFormat(value){
                if(value == 1){
                    return '请假'
                }else if(value ==2 ){
                    return '加班'
                }else{
                    return ''
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
            this.updateTabIndex(0);//用于留住tabIndex
			this.filterStatus(this.searchExamineForm.status);
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
                searchExamineForm:{
                    status:1,
                    page:1,
                    rows:5,
                },
                showloading:true,
                examineList:[],
                loadingtxt:'',
                wrapperHeight: 0,
                scrollDisabled:false,
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
