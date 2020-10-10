<template>
  <div>
    wellcome
    <loadingpage v-show="true"/>
  </div>
</template>

<script>
import Loadingpage from '@/components/Loading/LoadingPage'

export default {
  name: 'Welcome',
  components: {Loadingpage}
}
</script>

<style scoped>

</style>
