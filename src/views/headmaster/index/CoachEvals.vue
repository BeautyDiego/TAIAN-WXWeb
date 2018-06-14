<template>
	<div>
		<div ref="wrapper" :style="{ height: wrapperHeight + 'px' }" style="overflow: scroll;-webkit-overflow-scrolling:touch;color:#4a4a4a;">
			<group  v-infinite-scroll="loadMore"
					infinite-scroll-disabled="scrollDisabled"
					infinite-scroll-distance="10">
<flexbox orient="horizontal">
    	<flexbox-item :span="2/3">
				{{this.coachdata.Name}}
		</flexbox-item>
            <flexbox-item >
				 <rater :value="this.coachdata.ArgScore?parseFloat(this.coachdata.ArgScore):0" :font-size=18 disabled></rater>
		</flexbox-item>
</flexbox>
				<cell-box style="flex-direction: column;margin-bottom:0.5rem;"
						  v-for="(item,index) in examineList" :key="index"  :is-link="false">
					<flexbox orient="horizontal" >
						<flexbox-item :span="2/3">
							<flexbox orient="vertical">
								<flexbox-item >
									<flexbox>
										<flexbox-item >
											{{item.Name}}
										</flexbox-item>
			
									</flexbox>
								</flexbox-item>
                                    <flexbox>
                                        
                                        <flexbox-item >
                                                    {{item.SubjectName}}
                                        </flexbox-item>
                                         <flexbox-item >
                              <span >￥{{item.TradeCash}}</span>
                        </flexbox-item>
                                    </flexbox>
								<flexbox-item >
									<flexbox>
										<flexbox-item >
											{{item.EvalDate}}
										</flexbox-item>
                                       
									</flexbox>
								</flexbox-item>
							</flexbox>
						</flexbox-item>
                                        <flexbox-item >
                                            <rater :value="item.ArgScore?parseFloat(item.ArgScore):0" :font-size=18 disabled></rater>
                                        </flexbox-item>
                       
					</flexbox>
				
				</cell-box>
			</group>
			<load-more :show-loading="showloading"  :tip="loadingtxt" ></load-more>
		</div>
	</div>

</template>

<script>
    import { Tab, TabItem,Group, CellBox,Flexbox, FlexboxItem,Popup,XInput,Calendar,LoadMore,Popover,Rater,PopupPicker } from 'vux'
    import { mapState, mapActions } from 'vuex'
    import {getCoachEvals,getDepartmentList} from './../getData/getData'
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
            PopupPicker,
            Rater
        },
        methods: {
            async loadExamineList(){
                this.showloading=true;
                this.loadingtxt='正在加载'
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
            },
            loadMore() {
                this.loadExamineList();
                this.searchExamineForm.page++;
            },

            onChangePicker(val){
              this.searchExamineForm.departmentid=  this.deptList.find((value, index, arr)=> {
                    return value.DeName== val;
			  }).Id;
			  this.filterStatus(this.searchExamineForm.status);
			},
            ...mapActions([
                'updateTabIndex'
            ]),
        },
        created(){
            this.$store.commit("readAdminInfo");
            this.getDeptList();
        },
        mounted () {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top-50;
        },
        activated(){
            this.updateTabIndex(1);//用于留住tabIndex
            this.examineList=[]; 
            this.searchExamineForm.coach_id=this.$route.query.item.Coach_Id;
            this.coachdata=this.$route.query.item;
            this.searchExamineForm.page=1;
            this.searchExamineForm.rows=5;
           console.log('activated');
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
                examineList:[],
                loadingtxt:'',
                wrapperHeight: 0,
                scrollDisabled:false,
				deptList:[],
                coachdata:[],
                pickerValue:['全部'],
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
