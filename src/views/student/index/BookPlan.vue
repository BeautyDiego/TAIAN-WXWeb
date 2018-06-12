<template>
	<div>
		<div class="teachplan">
			<ul>
				<li style="background-color: #22c993" @click="routeTo('booktrain')">
					<div>
						<span  class="demo-icon" style="margin-right:0.5rem;font-size:4rem;color:#fff">&#xe699;</span>
					</div>
					<div>
						<span class="text">预约教练</span>
					</div>
				</li>
				<li style="background-color: #2491c9" @click="routeTo('todayAppointment')">
					<div>
						<span  class="demo-icon" style="margin-right:0.5rem;font-size:4rem;color:#fff">&#xe603;</span>
					</div>
					<div>
						<span class="text">今日预约</span>
					</div>
				</li>
			</ul>
		</div>
  
	</div>
</template>

<script>
    import { Search,Group, CellBox, Flexbox, FlexboxItem} from 'vux'

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
        },
        mounted () {
        
        },
        beforeDestroy () {
        },
        watch: {
        
        },
        computed: {
        
        },
        data () {
            return {
                searchStuName: ''
            }
        }
    }
</script>

<style lang="less" scoped>
	.teachplan{
		width:80%;
		margin:8.5rem auto;
		ul{
			li{
				box-sizing:content-box;
				vertical-align: middle;
				list-style: none;
				margin:2rem 0;
				border-radius: 8px;
				padding:0 5rem;
				height:8rem;
				color:#fff;
				    div{
						text-align: center;
						height:8rem;
						line-height:8rem;
						vertical-align: middle;
						display: inline-block;
						.text{
							font-size: 1.5rem;
						}
					}
					div:first-child{
						width:30%;
					}
					div:last-child{
						width:60%;
					}
			}
		}
	}
</style>
