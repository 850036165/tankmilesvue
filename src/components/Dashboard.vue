<template>
  <div>
    <p>dashboard首页看板</p>
    <loadingpage v-show="false"></loadingpage>
  </div>
</template>

<script>
import loadingpage from './Loading/LoadingPage'
export default {
  name: 'Dashbord',
  components: { loadingpage }
}
</script>

<style scoped>
</style>
