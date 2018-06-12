<template>
	<div>
		<flow >
			<flow-state state="1" title="科目一" :is-done="adminInfo.subjext>0||adminInfo.subjext==0"></flow-state>
			<flow-line :is-done="adminInfo.subjext>1&&adminInfo.subjext!=1||adminInfo.subjext==0" :line-span="20" :tip="adminInfo.subjext==1?'进行中':''"></flow-line>
			
			<flow-state state="2" title="科目二" :is-done="adminInfo.subjext>1||adminInfo.subjext==0"></flow-state>
			<flow-line :is-done="adminInfo.subjext>2&&adminInfo.subjext!=2||adminInfo.subjext==0" :line-span="20"  :tip="adminInfo.subjext==2?'进行中':''"></flow-line>
			
			<flow-state state="3" title="科目三" :is-done="adminInfo.subjext>2||adminInfo.subjext==0"></flow-state>
			<flow-line  :is-done="adminInfo.subjext>3&&adminInfo.subjext!=3||adminInfo.subjext==0" :line-span="20"   :tip="adminInfo.subjext==3?'进行中':''">></flow-line>
			
			<flow-state state="4" title="科目四" :is-done="adminInfo.subjext==0"></flow-state>
			<flow-line  :is-done="adminInfo.subjext==0" :line-span="20"   :tip="adminInfo.subjext==4?'进行中':''">></flow-line>
			
			<flow-state state="5" title="结业" :is-done="adminInfo.subjext==0"></flow-state>
		</flow>
		<div ref="wrapper" :style="{ height: wrapperHeight + 'px' }" style="overflow: scroll;-webkit-overflow-scrolling : touch;">
			<div  style="font-size:1.6rem;padding:1rem;margin-bottom:-0.8rem"><span  class="demo-icon" style="margin-right:0.5rem;color:#e85e6f">&#xe60a;</span>考试记录</div>
			<div v-for="(item,index) in examInfoList" :key="index" style="margin:1rem 1.2rem;border-top: 1px solid #F1F1F1;  border-bottom: 1px solid #F1F1F1;background-color: #fff">
				<flexbox orient="vertical" >
					<flexbox>
						<flexbox-item :span="1/9" class="flex-div" >
							<icon v-if="item.IsPass=='true'" type="success" style="font-size:32px;"></icon>
							<icon v-else type="cancel" style="font-size:32px;"></icon>
						</flexbox-item>
						<flexbox-item class="flex-div">
							<flexbox orient="vertical">
								<flexbox>
									<flexbox-item class="flex-div"><div > {{item.SubjextText}} </div></flexbox-item>
									<flexbox-item class="flex-div"><div > {{item.Score}}分</div></flexbox-item>
									<flexbox-item class="flex-div"><div :class="item.IsPass=='true'?'success-small-font':'error-small-font'">{{item.IsPassText}} </div></flexbox-item>
								</flexbox>
								<flexbox>
									<flexbox-item class="flex-div"><div >{{item.Place}} </div></flexbox-item>
								</flexbox>
							</flexbox>
						</flexbox-item>
					</flexbox >
					<flexbox>
						<flexbox-item class="flex-div"><div class="detail-small-font" style="padding-left:0.5rem"><span  class="demo-icon detail-small-font" style="margin:0 0.2rem">&#xe60e;</span>  {{item.BeginTime}} </div></flexbox-item>
						<flexbox-item class="flex-div"><div class="detail-small-font" style="padding-left:0.5rem"><span  class="demo-icon detail-small-font" style="margin:0 0.3rem">&#xe60f;</span>   {{item.EndTime}} </div></flexbox-item>
					</flexbox>
				</flexbox>
			</div>
			<load-more :show-loading="showloading"  :tip="loadingtxt"></load-more>
			<div style="padding-top:3.5rem;"></div>
		</div>
	</div>
</template>

<script>
    import { Flow, FlowState, FlowLine,Icon, Flexbox, FlexboxItem,LoadMore} from 'vux'
    import {examDetail} from './../getData/getData';
    import { mapState ,mapActions} from 'vuex'
    export default {
        components: {
            Flow,
            FlowState,
            FlowLine,
            Icon,
			Flexbox,
			FlexboxItem,
            LoadMore
        },
        methods: {
            async getExamInfo(){
                this.showloading=true;
                let res=await examDetail({},this.adminInfo.cookie_value);
                if (res.success){
                    this.examInfoList=res.result;
                    if (this.examInfoList.length ===0 ){
                        this.loadingtxt='暂无数据'
                    }else{
                        this.loadingtxt='无更多数据'
                    }
                }
                this.showloading=false;
            },
        },
		created(){
			this.$store.commit("readAdminInfo");
            this.getExamInfo();
		},
        mounted () {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
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
				step:2,
				examInfoList:[],
                wrapperHeight:0,
                showloading:false,
                loadingtxt:'',
            }
        }
    }
</script>

<style lang="less">
	.success-small-font{
	   color:#09BB01;
	}
	.error-small-font{
		color:#f43530;
	}
</style>
