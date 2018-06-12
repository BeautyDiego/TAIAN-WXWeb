<template>
	<div>
		<msg :title="title" :description="description" :buttons="buttons" :icon="icon"></msg>
	</div>
</template>

<script>
    import { Msg, Divider, XButton } from 'vux'
    import { mapActions } from 'vuex'
    export default {
        components: {
            Msg,
            Divider,
            XButton
        },
        created(){

        
		},
		activated(){
            this.queryParams= this.$route.query;
            if (this.queryParams.type==='success')
            {
                this.icon='success';
                this.title='支付成功';
                this.description='培训费用 ￥:'+this.queryParams.cash;
            }else{
                this.icon='warn';
                this.title='支付失败';
                this.description='';
            }
            this.updateTabIndex(1);
		},
        methods: {
            ...mapActions([
                'updateTabIndex'
            ]),
        },
        data () {
            return {
                title:'支付成功',
                description: '',
                icon: 'success',
                buttons: [{
                    type: 'primary',
                    text: '确定',
                    link: '/mybookdetail'
                }],
                queryParams:{},
            }
        }
    }
</script>
