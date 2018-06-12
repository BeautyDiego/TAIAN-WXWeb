<template>
	<div >
		<search
				placeholder="请输入学员姓名搜索"
				@result-click="resultClick"
				@on-change="getResult"
				v-model="searchStuForm.name"
				position="absolute"
				:autoFixed="false"
				auto-scroll-to-top top="100"
				@on-focus="onFocus"
				@on-cancel="onCancel"
				@on-submit="onSubmit"
				ref="search"></search>

			<div ref="wrapper" :style="{ height: wrapperHeight + 'px' }" style="overflow: scroll;-webkit-overflow-scrolling : touch;position:relative;">
				<group  v-infinite-scroll="loadMore"
						infinite-scroll-disabled="loading"
						infinite-scroll-distance="1">
					<cell-box style="flex-direction: column;" v-for="(item,index) in stuList" :key="index">
						<div class="stu-detail-wrapper">
							<div class="stu-detail-img">
								<img :src="item.HeadImage?item.HeadImage:'./../../../static/img/nophoto.png'"  alt="" class="weui-media-box__thumb" :onerror="NOPHOTO">
							</div>
							<div class="stu-detail-div">
								<flexbox>
									<flexbox-item><div class="stu-flex-detail">{{item.Name}}
										<span  class="demo-icon" style="margin-right:0.5rem;font-size:1rem" :style="{ color: item.Sex=='男'?'#0000ff':'#e4393c' }">{{item.Sex=='男'?'&#xe62d;':'&#xe73c;'}}</span>
									</div></flexbox-item>
									<flexbox-item><div class="stu-flex-detail">{{item.ShortName}}</div></flexbox-item>
								</flexbox>
								<flexbox>
									<flexbox-item><div class="stu-flex-detail">培训车型:<span class="stu-info-text">{{item.TrainType}}</span></div></flexbox-item>
								</flexbox>
								<flexbox>
									<flexbox-item><div class="stu-flex-detail">报名时间:<span class="stu-info-text">{{item.JoinDate}}</span></div></flexbox-item>
								</flexbox>
								<flexbox>
									<flexbox-item ><div class="stu-flex-detail">学员编号:<span class="stu-info-text">{{item.StuNum}}</span></div></flexbox-item>
								</flexbox>
								<flexbox>
									<flexbox-item><div class="stu-flex-detail">电话:<span class="stu-info-text">{{item.Phone}}</span></div></flexbox-item>
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
	import {stuList} from './../getData/getData'
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
                this.loadStuList();
                this.searchStuForm.page++;
            },
			async loadStuList(){
				this.loading=true;
   				let params=this.searchStuForm;
   				let res=await stuList(params,this.adminInfo.cookie_value)
   				if (res.success){
   				    if (res.result.length>0){
                        for (let i=0; i < res.result.length; i++) {
                            this.stuList.push( res.result[i] );
                        }
                        this.showloading=true;
                        this.loadingtxt='正在加载'
                        if (res.result.length<5){
                            this.showloading=false;
                            this.loadingtxt='无更多数据'
						}else{
                            this.loading=false;
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
                this.stuList=[];
                this.searchStuForm.page=1;
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
                stuList:[],
				searchStuForm:{
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

<style lang="less" >
	.stu-detail-wrapper{
		display:flex;
		flex-direction: row;
		width:95%;
	}
	.stu-detail-img{
		margin-right:1rem;
		padding-top:0.8rem;
		text-align: center;
		flex:1;
		align-items: center;
		img{
			width: 8rem;
			height: 8rem;
			line-height: 8rem;
		}
	}
	.stu-detail-div{
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 3;
		min-width: 0;
	}
	.stu-flex-detail{
	  padding:0.3rem;
	  font-size:1rem;
		.stu-info-text{
			color:#8f8f94;
		}
	}

</style>
