<template>
	<div>
		<search
				placeholder="请输入教练员姓名搜索"
				@result-click="resultClick"
				@on-change="getResult"
				v-model="searchCoachForm.name"
				position="absolute"
				:autoFixed="false"
				auto-scroll-to-top top="100"
				@on-focus="onFocus"
				@on-cancel="onCancel"
				@on-submit="onSubmit"
				ref="search"></search>
		<div style="padding:0.5rem 0.4rem;">
			<flexbox style="background-color:#fff;font-size:1.2rem;padding:0.5rem">
				<flexbox-item >
					{{searchCoachForm.date ==tomorrowDate?'明天':searchCoachForm.date}} / {{daySpanFormat(searchCoachForm.span)}}
				</flexbox-item>
				<div style="text-align:center;">
					<span  class="demo-icon" style="font-size:1.4rem;margin-right:1.5rem;" @click="searchDate">&#xe606;</span>
					<span  class="demo-icon" style="font-size:1.4rem;margin-right:1.5rem;" @click="searchDaySpan">&#xe627;</span>
				</div>
			</flexbox>
		</div>
	
		<div ref="wrapper" :style="{ height: wrapperHeight + 'px' }" style="overflow: scroll;-webkit-overflow-scrolling : touch;position:relative;">
			<group  v-infinite-scroll="loadMore"
					infinite-scroll-disabled="loading"
					infinite-scroll-distance="50">
				<cell-box style="flex-direction: column;"
						  :is-link="true"
						  :link="{path: 'bookcoachdetail', query: {id:item.Id,photo:item.Photo,date:searchCoachForm.date,span:searchCoachForm.span,coachName:item.CoachName}}"
						   v-for="(item,index) in coachList" :key="index">
					<flexbox :class="item.Remain==0?'isbookable':''">
						<flexbox-item :span="1/5" >
							<div class="coach-sculpture">
								<img :src="item.Photo?item.Photo:'./../../../static/img/nophoto.png'" :onerror="NOPHOTO"  alt="" class="weui-media-box__thumb" >
							</div>
						</flexbox-item>
						<flexbox-item >
							<flexbox orient="vertical">
								<flexbox-item >
									{{item.CoachName}}  <span style="font-size: 0.8rem;">{{item.DeName}}</span>
								</flexbox-item>
								<flexbox-item >
									<rater :value="item.EvalScore?parseFloat(item.EvalScore):0" :font-size=12 disabled></rater>
								</flexbox-item>
							</flexbox>
						</flexbox-item>
						<flexbox-item :span="1/4" >
							<div >
							    查看详情
							</div>
						</flexbox-item>
					</flexbox>
				</cell-box>
			</group>
			<load-more :show-loading="showloading" v-show="loading" :tip="loadingtxt"></load-more>
			<div style="padding-bottom:4rem"></div>
			<masker v-if="showMask" style="position:absolute;top:0;left:0;bottom:0;right:0">
			</masker>
		</div>
		<div v-transfer-dom>
			<popup v-model="showPopup">
				<!-- group already has a top border, so we need to hide header's bottom border-->
				<group :gutter=0>
					<inline-calendar
							v-if="popUpDateIndex==1"
							v-model="searchCoachForm.date"
									 :start-date="searchStartDate"
									 :end-date="searchEndDate" @on-change="searchChange"></inline-calendar>
					<radio v-if="popUpDateIndex==2" :options="daySpanOptions" v-model="searchCoachForm.span" @on-change="searchChange"></radio>
				</group>
			</popup>
		</div>
	</div>
</template>

<script>
    import { Group, CellBox,Flexbox, FlexboxItem,Popup,XInput,InlineCalendar,LoadMore,Search,TransferDom,Radio,Rater,Masker} from 'vux'
    import { mapState, mapActions } from 'vuex'
	import {bookCoachList} from './../getData/getData'
    export default {
        directives: {
            TransferDom
        },
        components: {
            Group,
			CellBox,
            Flexbox,
			FlexboxItem,
            Popup,
            XInput,
            InlineCalendar,
            LoadMore,
            Search,
			TransferDom,Radio,Rater,Masker
        },
        methods: {
            async loadReservationList(){
                this.loading = true;
                let params=this.searchCoachForm;
                let res=await bookCoachList(params,this.adminInfo.cookie_value)
                console.log(res);
                if (res.success){
                    if (res.result.length>0){
                        for (let i=0; i < res.result.length; i++) {
                            this.coachList.push( res.result[i] );
                        }
                        this.showloading=true;
                        this.loadingtxt='正在加载'
                        if (res.result.length<5){
                            this.showloading=false;
                            this.loadingtxt='无更多数据'
                        }else{
                            this.loading = false;
						}
                    }else{
                        this.showloading=false;
                        this.loadingtxt='无更多数据'
                    }

                }

            },
            loadMore() {
                this.loadReservationList();
                this.searchCoachForm.page++;
            },
            setFocus () {
                this.showMask=true;
                this.$refs.search.setFocus()
            },
            resultClick (item) {
                window.alert('you click the result item: ' + JSON.stringify(item))
            },
            getResult (val) {
                console.log(val);
            },
            onSubmit () {
                this.$refs.search.setBlur();
                this.coachList=[];
                this.searchCoachForm.page=1;
                this.loadMore();
                this.showMask=false;
            },
            onFocus () {
                this.showMask=true;
            },
            onCancel () {
                this.showMask=false;
            },
            searchDate(){
             this.showPopup=true;
             this.popUpDateIndex=1;
			},
            searchDaySpan(){
			 this.showPopup=true;
			 this.popUpDateIndex=2;
            },
			daySpanFormat(key){
             return this.daySpanOptions.find(d => d.key===key).value;
			},
            searchChange(){
			
                this.coachList=[];
                this.searchCoachForm.page=1;
                let me=this;
                setTimeout(function () {
                    console.log(me.searchCoachForm.span)
					me.loadMore();
                },100)
               // this.loadMore();
			},
            ...mapActions(['updateTabIndex']),
        },
		created(){
            this.$store.commit("readAdminInfo");
           
            let day1 = new Date();
            day1.setTime(day1.getTime()+24*60*60*1000);
            let tomorrow= day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
            this.searchCoachForm.date=tomorrow;
            this.tomorrowDate=tomorrow;
            
		},
        mounted () {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        },
        activated(){
		    this.updateTabIndex(0);
		},
        beforeDestroy () {
        },
        watch: {
        
        },
        computed: {
            ...mapState({
                adminInfo: state => state.usercookie.adminInfo,
            }),
            searchStartDate(){
                let day1 = new Date();
                day1.setTime(day1.getTime()+24*60*60*1000);
                return day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
			},
            searchEndDate(){
                let day1 = new Date();
                day1.setTime(day1.getTime()+24*60*60*1000*10);
                return day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
            }
        },
        data () {
            return {
                searchCoachForm:{
                    name:'',
                    date:'',
                    span:'0',
                    page:1,
                    rows:5,
                },
                showMask:false,
                loading:false,
                showloading:true,
				coachList:[],
                loadingtxt:'',
                wrapperHeight: 0,
                showPopup:false,
				popUpDateIndex:1,
                daySpanOptions:[{
                    key: '0',
                    value: '全天'
                },{
                    key: '1',
                    value: '上午'
                },{
                    key: '2',
                    value: '下午'
                },{
                    key: '3',
                    value: '晚上'
                }],
				tomorrowDate:'',
				value:3.3,
            }
        }
    }
</script>

<style lang="less" >
.coach-sculpture{
	text-align:center;
	img{
		width: 60px;
		height: 60px;
		border-radius: 50%;
	}
}
	
	.isbookable{
		color:#9b9b9b;
	}
</style>
