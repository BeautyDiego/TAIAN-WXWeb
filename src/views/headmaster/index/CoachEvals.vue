<template>
	<div>
		<divider style="margin-top:2rem;"><span style="font-size: 1.5rem">{{coachdata.Name}}</span><rater :value="coachdata.ArgScore?parseFloat(coachdata.ArgScore):0" :font-size=18 disabled></rater></divider>
		<div ref="wrapper" :style="{ height: wrapperHeight + 'px' }" style="overflow: scroll;-webkit-overflow-scrolling:touch;color:#4a4a4a;">
			<group  title="教练员订单评价"
					v-infinite-scroll="loadMore"
					infinite-scroll-disabled="scrollDisabled"
					infinite-scroll-distance="10">
			
				<cell-box style="flex-direction: column;margin-bottom:0.5rem;"
						  v-for="(item,index) in examineList" :key="index"  :is-link="false">
					<flexbox orient="horizontal" >
						<flexbox-item :span="1/2">
							<span class="eval-title">评价学员</span><span class="eval-value">{{item.Name}}</span>
						</flexbox-item>
						<flexbox-item >
							<span class="eval-title">培训科目</span><span class="eval-value">{{item.SubjectName}}</span>
						</flexbox-item>
                       
					</flexbox>
					<flexbox orient="horizontal" >
						<flexbox-item :span="1/2">
							<span class="eval-title">评价时间</span><span class="eval-value">{{item.EvalDate}}</span>
						</flexbox-item>
						<flexbox-item >
							<rater :value="item.ArgScore?parseFloat(item.ArgScore):0" :font-size=18 disabled></rater>
						</flexbox-item>
					
					</flexbox>
					<flexbox orient="horizontal" >
						<div style="width:5rem;">
							<span class="eval-title">评价内容</span>
						</div>
						<div style="flex:1">
							<span class="eval-value">{{item.Details}}</span>
						</div>
						
					</flexbox>
					
					
					
				
				</cell-box>
			</group>
			<load-more :show-loading="showloading"  :tip="loadingtxt" ></load-more>
		</div>
	</div>

</template>

<script>
    import { Tab, TabItem,Group, CellBox,Flexbox, FlexboxItem,XInput,LoadMore,Rater,Divider,XTextarea   } from 'vux'
    import { mapState, mapActions } from 'vuex'
    import {getCoachEvals,getDepartmentList} from './../getData/getData'
    export default {
        components: {
            Tab, TabItem,
            Group,
            CellBox,
            Flexbox,
            FlexboxItem,
            XInput,
            LoadMore,
            Divider,
            Rater,
            XTextarea
        },
        methods: {
            async loadExamineList(){
                this.showloading=true;
                this.loadingtxt='正在加载';
                let params=this.searchExamineForm;
                let res=await getCoachEvals(params,this.adminInfo.cookie_value)
                console.log(res);
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
                this.showloading=false;
                this.loadingtxt='无更多数据';
                this.scrollDisabled=true;
            },
            loadMore() {
                this.loadExamineList();
                this.searchExamineForm.page++;
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
            this.examineList=[];
            this.searchExamineForm.coach_id=this.$route.query.item.Coach_Id;
            this.coachdata=this.$route.query.item;
            this.searchExamineForm.page=1;
            this.searchExamineForm.rows=5;
            this.loadMore();
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
                    coach_id:1,
                    page:1,
                    rows:5
                },
                showloading:true,
                examineList:[{Name:'sad',SubjectName:'kemuer',EvalDate:'2017-02-02',ArgScore:3,Details:'我们就是以恶敖德萨多'}],
                loadingtxt:'',
                wrapperHeight: 0,
                scrollDisabled:false,
				deptList:[],
                coachdata:[],
            }
        }
    }
</script>

<style lang="less" scoped>
.eval-title{
	font-size: 0.8rem;
	color:#999;
	padding-right: 1rem;
}
.eval-value{
	font-size:1.2rem;
}
</style>
