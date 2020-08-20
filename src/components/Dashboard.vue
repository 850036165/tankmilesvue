<template>
  <div>
    <p>
      <iframe src="https://maplab.amap.com/share/mapv/48cc193c83373cc445497f0b70f93d19"
              style="width: 100%;height: 500px"></iframe>
    </p>
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
