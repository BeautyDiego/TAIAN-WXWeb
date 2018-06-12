<template>
	<div>
		<div class="teachplan">
			<ul>
				<li style="background-color: #f0bb00" @click="routeTo('myattendence')">
					<div class="title-img">
						<img src="./../../../assets/img/clock.png">
					</div>
					<div class="title-text">
						<span class="text">我的考勤</span>
					</div>
				</li>
				<li style="background-color: #16878d" @click="routeTo('monthplan')">
					<div class="title-img">
						<img src="./../../../assets/img/monthplan.png">
					</div>
					<div  class="title-text">
						<span class="text">月度计划</span>
					</div>
				</li>
				<li style="background-color: #8f82bc" @click="routeTo('todayAppointment')">
					<div class="title-img">
						<img src="./../../../assets/img/todaybook.png">
					</div>
					<div  class="title-text">
						<span class="text">今日预约</span>
					</div>
				</li>
				<li style="background-color: #e38989" @click="routeTo('workexamine')">
					<div class="title-img">
						<img src="./../../../assets/img/examine.png">
					</div>
					<div  class="title-text">
						<span class="text">考勤审批</span>
					</div>
				</li>
			</ul>
		</div>
  
	</div>
</template>

<script>
    import { Search,Group, CellBox, Flexbox, FlexboxItem} from 'vux'
    import {  mapActions } from 'vuex'
    export default {
        components: {
            Search,
            CellBox,
			Group,
            Flexbox,
            FlexboxItem,
        },
        methods: {
            routeTo(name){
                if (name ==='todayAppointment'){
                    let day1 = new Date();
                    let PlanDate = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
                    this.$router.push({ path: 'monthplandetail', query: {day:PlanDate,dayspan:0 }});
				}else{
                    this.$router.push(name);
				}
            },
            ...mapActions([
                'updateTabIndex'
            ]),
        },
        mounted () {
        
        },
        activated(){
            this.updateTabIndex(0);//用于留住tabIndex
        },
        beforeDestroy () {
        },
        watch: {
        
        },
        computed: {
        
        },
        data () {
            return {
				personalInfo:{
                    DeName:'广东立腾',
					Name:'我是大哥',
					NickName:'Bruce',
                    IdCard:'42011116610241251',
					Phone:'18624447751'
				},
                searchStuName: ''
            }
        }
    }
</script>

<style lang="less" scoped>
	.teachplan{
		width:85%;
		margin:5.5rem auto;
		ul{
			li{
				display: flex;
				box-sizing:content-box;
				vertical-align: middle;
				list-style: none;
				margin:2rem 0;
				border-radius: 4rem;
				padding:0 5rem;
				height:8rem;
				color:#fff;
				    div{
						height:8rem;
						line-height:8rem;
						display: flex;
						align-items: center;
						
						.text{
							font-size: 2rem;
							font-weight:800;
							text-shadow:1px 1px 6px #000;
						}
						img{
							width:4rem;
						}
					}
					div:first-child{
						width:40%;
						justify-content: flex-start;
					}
					div:last-child{
						width:60%;
						justify-content: flex-end;
					}
			}
		}
	}
</style>
