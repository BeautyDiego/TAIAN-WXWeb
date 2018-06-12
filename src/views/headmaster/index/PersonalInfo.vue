<template>
	<div style="height:100%;overflow:scroll">
		<group title="校长信息">
	
			<cell title="所属驾校" :value="adminInfo.dename" ></cell>
			<cell title="姓名"  :value="adminInfo.name"></cell>
			<cell title="用户名" :value="adminInfo.nick_name" ></cell>
			<cell title="身份证号" :value="adminInfo.id_card" ></cell>
			<cell title="电话" :value="adminInfo.mobile" ></cell>
		</group>
		<group title="列表管理">
			<cell title="学员列表" link="/stulist" >
				<span slot="icon" class="demo-icon" style="margin-right:0.5rem;color:#6fc777" >&#xe643;</span>
			</cell>
			<cell title="教练员列表" link="/coachlist" >
				<span slot="icon" class="demo-icon" style="margin-right:0.5rem;color:#e2ae5c">&#xe637;</span>
			</cell>
			<cell title="车辆列表" link="/carlist" >
				<span slot="icon" class="demo-icon" style="margin-right:0.5rem;font-size: 15px;color:#72a6ec">&#xe64d;</span>
			</cell>
			<cell title="训练场列表" link="/trainsitelist" >
				<span slot="icon" class="demo-icon" style="margin-right:0.5rem;color:#e85e6f">&#xe634;</span>
			</cell>
		</group>
		<div style="padding:2rem 1rem">
			<x-button type="warn"  @click.native="Logout">退出登录</x-button>
		</div>
		<div style="padding-bottom:4rem"></div>
	</div>
</template>

<script>
    import { Group, Cell,XButton} from 'vux'
    import { mapState, mapActions } from 'vuex'
    import {logout} from './../getData/getData'

    export default {
        components: {
            Cell,
			Group,
            XButton
        },
        methods: {
            async Logout(){
                let res= await logout({},this.adminInfo.cookie_value);
                this.$router.push('/Redirect');
            },
            ...mapActions([
                'updateTabIndex'
            ]),
        },
		created(){
            this.$store.commit("readAdminInfo");
		},
        mounted () {
        },
        activated(){
            this.updateTabIndex(2);//用于留住tabIndex
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
