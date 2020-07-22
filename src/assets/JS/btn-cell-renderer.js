import Vue from 'vue/dist/vue.esm.js'

export default Vue.extend({
  template: `
    <span>
            <button class="enterButton" @click="btnClickedHandler()">{{this.params.value}}</button>
        </span>
  `,
  methods: {
    btnClickedHandler () {
      this.params.clicked(this.params.value)
    }
  }
})
