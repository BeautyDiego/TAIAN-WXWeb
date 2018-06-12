<template>
	<div>
		<search
				placeholder="请输入车牌搜索"
				@result-click="resultClick"
				@on-change="getResult"
				v-model="searchTrainsiteForm.name"
				position="absolute"
				:autoFixed="false"
				auto-scroll-to-top top="100"
				@on-focus="onFocus"
				@on-cancel="onCancel"
				@on-submit="onSubmit"
				ref="search"></search>
		<div ref="wrapper" :style="{ height: wrapperHeight + 'px' }" style="overflow: scroll;-webkit-overflow-scrolling: touch;position:relative;">
			<group v-infinite-scroll="loadMore"
				   infinite-scroll-disabled="loading"
				   infinite-scroll-distance="10" >
				<cell-box style="flex-direction: column;" v-for="(item,index) in trainSiteList" :key="index">
					<div class="stu-detail-wrapper">
						<div class="stu-detail-div">
							<flexbox>
								<flexbox-item><div class="stu-flex-detail" style="font-size:1.4rem;">{{item.Name}}</div></flexbox-item>
							</flexbox>
							<flexbox>
								<flexbox-item ><div class="stu-flex-detail">{{item.DepartMentName}}</div></flexbox-item>
								<flexbox-item><div class="stu-flex-detail">车辆数:<span class="stu-info-text">{{item.CurVehNum}}</span></div></flexbox-item>
							</flexbox>
						</div>
					</div>
					<div class="stu-detail-wrapper stu-detail-div stu-detail-bottom">
						<div class="stu-detail-div ">
							<flexbox>
								<flexbox-item ><div class="stu-flex-detail"><span  class="demo-icon" style="margin-right:0.5rem;font-size:1.3rem">&#xe634;</span><span>{{item.Address}}</span></div></flexbox-item>
							</flexbox>
						</div>
					
					</div>
				
				</cell-box>
			</group>
			<load-more :show-loading="showloading"  :tip="loadingtxt"></load-more>
			<div style="padding-bottom:4rem"></div>
			<masker v-if="showMask" style="position:absolute;top:0;left:0;bottom:0;right:0">
			</masker>
		</div>
		
	</div>
</template>

<script>
    import { Search,Group, CellBox, Flexbox, FlexboxItem,LoadMore,Masker} from 'vux'
    import {trainsiteList} from './../getData/getData'
    import { mapState, mapActions } from 'vuex'
    export default {
        components: {
            Search,
            CellBox,
            Group,
            Flexbox,
            FlexboxItem,
            LoadMore,
            Masker,
        },
        methods: {
            loadMore() {
                this.loadTrainSiteList();
                this.searchTrainsiteForm.page++;
            },
            async loadTrainSiteList(){
                this.loading = true;
                let params=this.searchTrainsiteForm;
                let res=await trainsiteList(params,this.adminInfo.cookie_value)
                if (res.success){
                    if (res.result.length>0){
                        for (let i=0; i < res.result.length; i++) {
                            this.trainSiteList.push( res.result[i] );
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
                this.trainSiteList=[];
                this.searchTrainsiteForm.page=1;
                this.loadMore();
                this.showMask=false;
            },
            onFocus () {
                this.showMask=true;
            },
            onCancel () {
                this.showMask=false;
            }
        },
        created(){
            this.$store.commit("readAdminInfo");
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
                trainSiteList:[],
                searchTrainsiteForm:{
                    name:'',
                    page:1,
                    rows:5,
                },
                loading:false,
                showloading:true,
                loadingtxt:'正在加载',
                wrapperHeight: 0,
                showMask:false,
            }
        }
    }
</script>

<style lang="less">

</style>
