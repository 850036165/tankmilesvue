<template>
  <div>
    contact
    <model-stl
      :lights="[
        {
          type: 'PointLight', // 灯光类型
          position: { x: 50, y: 50, z: 50 }, // 灯光位置
          intensity: 0.6,
        },
        {
          type: 'DirectionalLight', // 灯光类型
          position: { x: -1, y: -1, z: -1 }, // 灯光位置
          intensity: 0.8
        }]"
      :width="
        500"
      :height="500"
      background-color="#58647a"
      src="http://oss.tankmiles.com/JUMO.STL"
    />
  </div>
</template>

<script>
import {ModelStl} from 'vue-3d-model'

export default {
  name: 'Contact',
  components: { ModelStl }
}
</script>

<style scoped>

</style>
