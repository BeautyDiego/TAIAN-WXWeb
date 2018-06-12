<template>
	<div class="book-rule">
		<p>
			1.预约培训需提前24小时预约
		</p>
		<p>
			2.只能预约未来10天以内的课程
		</p>
		<p>
			3.预约培训后需教练确认已完成，并完成支付以后才能进行下一次预约
		</p>
		<p>
			4.预约后未完成培训，七天以后才能进行下一次预约
		</p>
		<p>
			5.早于预约时间的24小时前可以取消预约
		</p>
	</div>
</template>

<script>
    import { mapActions } from 'vuex'
    export default {
        components: {

        },
        methods: {

        },
		created(){

		},
        mounted () {
        
        },
        beforeDestroy () {
            //this.box && this.box.removeEventListener('scroll', this.handler, false)
        },
        watch: {
        
        },
        computed: {

        },
        data () {
            return {

            }
        }
    }
</script>

<style lang="less" scoped>
.book-rule{
	height:100%;
	padding-top:1rem;
	p{
		font-size: 1.3rem;
		padding:0.2rem 1rem;
		width:100%;
		box-sizing: border-box;
	}
}
</style>
