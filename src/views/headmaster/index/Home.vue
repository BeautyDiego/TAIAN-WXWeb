<template>
	<div style="height:100%;overflow:scroll">
		<divider>驾校统计</divider>
		<card >
			<div slot="content" class="card-demo-flex card-demo-content01">
				<div @click="routTo('/stulist')" >
					<img src="./../../../assets/img/masterstu.png" alt="">
					<p><span>{{homeData.StuCount}}</span>人</p>
					<p>学员</p>
				</div>
				<div @click="routTo('/coachlist')">
					<img src="./../../../assets/img/mastercoach.png" alt="">
					<p><span>{{homeData.CoachCount}}</span>人</p>
					<p>教练</p>
				</div>
				<div @click="routTo('/carlist')">
					<img src="./../../../assets/img/mastercar.png" alt="">
					<p><span>{{homeData.CarCount}}</span>辆</p>
					<p>车辆</p>
				</div>
				<div @click="routTo('/trainsitelist')">
					<img src="./../../../assets/img/mastertrainsite.png" alt="">
					<p><span>{{homeData.TrainSitCount}}</span>个</p>
					<p>训练场</p>
				</div>
			</div>
		</card>
		
		<card >
			<div slot="header" class="detail-header"><span class="detail-icon" >&#xe643;</span>&nbsp学员情况</div>
			<div slot="content" >
				<flexbox>
					<flexbox-item><div class="flex-detail">今日报名:<span>{{homeData.StuAddToday}}</span>人</div></flexbox-item>
					<flexbox-item><div class="flex-detail">昨日报名:<span>{{homeData.StuAddYesterday}}</span>人</div></flexbox-item>
				</flexbox>
				<flexbox>
					<flexbox-item><div class="flex-detail">本月招生:<span>{{homeData.StuAddMonth}}</span>人</div></flexbox-item>
					<flexbox-item><div class="flex-detail">在培学员:<span>{{homeData.StuInStudy}}</span>人</div></flexbox-item>
				</flexbox>
			</div>
		</card>
		<card >
			<div slot="header" class="detail-header"><span class="detail-icon" >&#xe637;</span>&nbsp教练情况</div>
			<div slot="content" >
				<flexbox>
					<flexbox-item><div class="flex-detail">教练人数:<span>{{homeData.CoachCount}}</span>人</div></flexbox-item>
				</flexbox>
			</div>
		</card>
		<card >
			<div slot="header" class="detail-header"><span class="detail-icon" >&#xe64d;</span>&nbsp车辆情况</div>
			<div slot="content" >
				<flexbox>
					<flexbox-item><div class="flex-detail">车辆总数:<span>{{homeData.CarCount}}</span>辆</div></flexbox-item>
				</flexbox>
			</div>
		</card>
		<card >
			<div slot="header" class="detail-header"><span class="detail-icon" >&#xe634;</span>&nbsp训练场情况</div>
			<div slot="content" >
				<flexbox>
					<flexbox-item><div class="flex-detail">训练场总数:<span>{{homeData.TrainSitCount}}</span>人</div></flexbox-item>
				</flexbox>
			</div>
		</card>
		<div style="padding-bottom:5rem"></div>
	</div>
</template>

<script>
    import {Divider, Card, Flexbox, FlexboxItem} from 'vux'
    import {home} from './../getData/getData'
    import { mapState, mapActions } from 'vuex'
    export default {
        components: {
            Divider,
            Card,
            Flexbox,
            FlexboxItem,
        },
        methods: {
        	async getHomeCount(){
				const res=await home({},this.adminInfo.cookie_value);
                this.homeData=res.result[0];
			},
            routTo(name){
                this.$router.push(name);
			},
            ...mapActions([
                'updateTabIndex'
            ]),
        },
        created(){
        
        },
        mounted () {
            this.getHomeCount();
        },
        activated(){
            this.updateTabIndex(0);//用于留住tabIndex
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
				homeData:{
                    CarCount:0,
                    CoachCount:0,
                    TrainSitCount:0,
                    StuCount:0,
                    StuAddMonth:0,
                    StuAddToday:0,
                    StuAddYesterday:0,
                    StuInStudy:0,
				}
            }
        }
    }
</script>

<style lang="less">
	.card-demo-flex {
		display: flex;
		span{
			color: #f74c31;
		}
		img{
			width:80px;
			height:80px;
		}
	}
	.card-demo-content01 {
		padding: 10px 0;
	}
	.card-padding {
		padding: 15px;
	}
	.card-demo-flex > div {
		flex: 1;
		text-align: center;
		font-size: 12px;
	}
	
	.detail-header{
		padding:0.5rem 1.5rem;
		font-size:1.3rem;
	}
	.detail-icon {
		font-family: 'iconfont';
		font-size: 1.3rem;
		color: #888;
	}
	.flex-detail{
	  padding:0.5rem 1.5rem;
	  font-size:1.2rem;
		span{
			color: #f74c31;
		}
	}
</style>
