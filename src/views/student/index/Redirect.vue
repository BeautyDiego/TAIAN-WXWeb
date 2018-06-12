<template>
	<div >
	
	</div>
</template>

<script>
    import {redirect} from './../getData/getData';
    import {frontWebUrl} from './../../../fetchConfig/env';
    export default {
		created(){
            window.localStorage.removeItem('tabIndexStu');
           this.doRedirect();
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

            }
        },
        methods: {
            async doRedirect(){
                const params={call_back:frontWebUrl+'/views/student/index.html#/login'};
				const res= await redirect(params);
				if (res.success){
				    window.location = res.result.url;
				}
            }
        },
    }
</script>

<style lang="less">

</style>
