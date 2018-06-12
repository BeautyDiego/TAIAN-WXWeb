<template>
	<div>
		<search
				placeholder="请输入教练员姓名搜索"
				@result-click="resultClick"
				@on-change="getResult"
				v-model="searchCoachName"
				position="absolute"
				auto-scroll-to-top top="0"
				@on-focus="onFocus"
				@on-cancel="onCancel"
				@on-submit="onSubmit"
				ref="search"></search>
		<group style="margin-top:18px;">
			<cell-box style="flex-direction: column;" v-for="(item,index) in coachList" :key="index">
				   <div class="stu-detail-wrapper">
					   <div class="stu-detail-img">
						   <img src="http://placeholder.qiniudn.com/60x60/3cc51f/ffffff" alt="" class="weui-media-box__thumb">
					   </div>
					   <div class="stu-detail-div">
						   <flexbox>
							   <flexbox-item><div class="stu-flex-detail">{{item.Name}}</div></flexbox-item>
							   <flexbox-item><div class="stu-flex-detail">{{item.DepartMentName}}</div></flexbox-item>
						   </flexbox>
						   <flexbox>
							   <flexbox-item><div class="stu-flex-detail">供职状态:<span>{{item.EmployStatusText}}</span></div></flexbox-item>
							   <flexbox-item><div class="stu-flex-detail">准教类型:<span>{{item.TeachPermittedText}}</span></div></flexbox-item>
						   </flexbox>
					
					   </div>
				   </div>
				   <div class="stu-detail-wrapper stu-detail-bottom">
					   
					   <flexbox>
						   <flexbox-item :span="1/2"><div class="stu-flex-detail">身份证:<span>{{item.IdCard}}</span></div></flexbox-item>
						   <flexbox-item :span="1/7"><div class="stu-flex-detail">性别:<span>{{item.SexStr}}</span></div></flexbox-item>
						   <flexbox-item><div class="stu-flex-detail">电话:<span>{{item.Mobile}}</span></div></flexbox-item>
					   </flexbox>
				   </div>
				
			</cell-box>
			
		</group>
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
            setFocus () {
                this.$refs.search.setFocus()
            },
            resultClick (item) {
                window.alert('you click the result item: ' + JSON.stringify(item))
            },
            getResult (val) {
            
            },
            onSubmit () {
                this.$refs.search.setBlur()
                this.$vux.toast.show({
                    type: 'text',
                    position: 'top',
                    text: 'on submit'
                })
            },
            onFocus () {
                console.log('on focus')
            },
            onCancel () {
                console.log('on cancel')
            }
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
				coachList:[{Name:'赵子龙',DepartMentName:'大神驾校',IdCard:'420111133265214020',Mobile:'16254441123',EmployStatusText:'在职',TeachPermittedText:'C1',SexStr:'男'},{Name:'赵子龙',DepartMentName:'大神驾校',IdCard:'420111133265214020',Mobile:'16254441123',EmployStatusText:'在职',TeachPermittedText:'C1',SexStr:'男'},{Name:'赵子龙',DepartMentName:'大神驾校',IdCard:'420111133265214020',Mobile:'16254441123',EmployStatusText:'在职',TeachPermittedText:'C1',SexStr:'男'}],
                searchCoachName: ''
            }
        }
    }
</script>

<style lang="less">
	.stu-detail-wrapper{
		display:flex;
		flex-direction: row;
		width:95%;
	}
	.stu-detail-img{
		margin-right: .8em;
		text-align: center;
		flex:1;
		img{
			width: 60px;
			height: 60px;
			line-height: 60px;
		}
	}
	.stu-detail-div{
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 3;
		min-width: 0;
	}
	.stu-flex-detail{
	  padding:0.5rem;
	  font-size:1rem;
	}
	.stu-detail-bottom{

		color:#8f8f94;
	}
</style>
