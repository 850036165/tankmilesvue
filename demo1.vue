<template>
  <div>
    <ul>
      <li v-for="(item,index) in list"
          v-bind:key="index"
          :class="{active:index===current,green:isGreen,}"
          @click="changecolor(index)">
        {{item}}
      </li>
    </ul>
    <button @click="add(current)">添加</button>
    <ul>
      <li v-for="(target,index) in target" v-bind:key="index">
        {{target}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'demo1',
  data () {
    return {
      current: '',
      isGreen: true,
      list: [1, 2, 3, 4, 5, 6, 7],
      target: []
    }
  },
  methods: {
    changecolor (index) {
      this.current = index
      console.log(this.current)
    },
    add (index) {
      if (this.current === '') {
        return
      }
      this.target.push(this.list[this.current])
    }
  }

}
</script>

<style scoped>
li.active{background: green}
</style>
