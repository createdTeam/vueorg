<template>
    <div>
        {{ msg }}
    </div>
</template>

<script>
import api from '../api/api';

export default {
    name:"first",
    data(){
        return{
            msg:null,
        }
    },
    created(){
        this.$nextTick(()=>{
            this.beforinit();
        })
    },
    methods:{
        beforinit(){
            this.msg = 'Hello Word'
        }
    }
}
</script>