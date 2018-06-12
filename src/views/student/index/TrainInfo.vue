<template>
	<div>
		<group style="margin-top:18px;" >
			<cell-box  :link="{ name: 'traindetail', params: { subject: 1 }}">
				<div class="list-detail-wrapper traininfo-detail" >
					<div class="list-detail-div" style="line-height:4rem;">
						<span  class="demo-icon" style="margin-right:0.5rem;font-size:2.4rem;">&#xe631;</span>
						科目一
					</div>
					<div class="list-detail-div" style="font-size: 1.2rem;    line-height: 24px;">
						<div>
							有效学时<span style="color:#e64340">&nbsp{{ValideTimeFormatter(1)}}</span>
						</div>
						<div>
							达标学时<span style="color:#6fc777">&nbsp{{TotalTimeFormatter(1)}}</span>
						</div>
					</div>
				</div>
			</cell-box>
			<cell-box :link="{ name: 'traindetail', params: { subject: 2 }}" >
				<div class="list-detail-wrapper traininfo-detail">
					<div class="list-detail-div" style="line-height:4rem;">
						<span  class="demo-icon" style="margin-right:0.5rem;font-size:2.4rem">&#xe613;</span>
						科目二
					</div>
					<div class="list-detail-div" style="font-size: 1.2rem;    line-height: 24px;">
						<div>
							有效学时<span style="color:#e64340">&nbsp{{ValideTimeFormatter(2)}}</span>
						</div>
						<div>
							达标学时<span style="color:#6fc777">&nbsp{{TotalTimeFormatter(2)}}</span>
						</div>
					</div>
				</div>
			</cell-box>
			<cell-box :link="{ name: 'traindetail', params: { subject: 3 }}" >
				<div class="list-detail-wrapper traininfo-detail">
					<div class="list-detail-div" style="line-height:4rem;">
						<span  class="demo-icon" style="margin-right:0.5rem;font-size:2.4rem;">&#xe614;</span>
						科目三
					</div>
					<div class="list-detail-div" style="font-size: 1.2rem;    line-height: 24px;">
						<div>
							有效学时<span style="color:#e64340">&nbsp{{ValideTimeFormatter(3)}}</span>
						</div>
						<div>
							达标学时<span style="color:#6fc777">&nbsp{{TotalTimeFormatter(3)}}</span>
						</div>
					</div>
				</div>
			</cell-box>
			<cell-box :link="{ name: 'traindetail', params: { subject: 4 }}" >
				<div class="list-detail-wrapper traininfo-detail">
					<div class="list-detail-div" style="line-height:4rem;">
						<span  class="demo-icon" style="margin-right:0.5rem;font-size:2.4rem">&#xe61d;</span>
						科目四
					</div>
					<div class="list-detail-div" style="font-size: 1.2rem;    line-height: 24px;">
						<div>
							有效学时<span style="color:#e64340">&nbsp{{ValideTimeFormatter(4)}}</span>
						</div>
						<div>
							达标学时<span style="color:#6fc777">&nbsp{{TotalTimeFormatter(4)}}</span>
						</div>
					</div>
				</div>
			</cell-box>
		</group>
	</div>
</template>

<script>
    import { Group, CellBox, Flexbox, FlexboxItem} from 'vux'
	import {trainInfo} from './../getData/getData';
    import { mapState, mapActions } from 'vuex'
    export default {
        components: {
            CellBox,
			Group,
            Flexbox,
            FlexboxItem,
        },
        methods: {
           async getTrainInfo(){
               let res=await trainInfo({},this.adminInfo.cookie_value);
               if (res.success){
                   this.trainInfoList=res.result;
			   }
		   },
			ValideTimeFormatter(subject){
               if (this.trainInfoList.length>0){
                   if (this.trainInfoList.find((t)=>t.Subject==subject)){
                       return this.trainInfoList.find((t)=>t.Subject==subject).ValidTime;
                   }else{
                       return '0小时';
				   }
			   }else{
   				    return '0小时';
			   }
			},
            TotalTimeFormatter(subject){
                if (this.trainInfoList.length>0){
                    if (this.trainInfoList.find((t)=>t.Subject==subject)){
                        return this.trainInfoList.find((t)=>t.Subject==subject).TimeTotal;
                    }else{
                        return '0小时';
					}
				}else{
                    return '0小时';
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
           this.getTrainInfo();
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
				trainInfoList:[],
            }
        }
    }
</script>

<style lang="less">
	.list-detail-wrapper{
		display:flex;
		flex-direction: row;
		width:100%;
		
	}
	.list-detail-div{
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
		min-width: 0;
		-webkit-box-align: center; -moz-box-align: center; /*混合版本语法*/
		-ms-flex-align: center; /*新版本语法*/
		-webkit-align-items: center;
		align-items: center;
	}
	.traininfo-detail{
		line-height:2rem;
		font-size:2rem;
		padding:1.5rem;
	}
</style>
