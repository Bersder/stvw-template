<template>
  <div class="container">
    <logo />
    <p class="text" @click="sayHello">{{ message }}</p>
    <p class="content">欢迎使用微前端脚手架</p>
    <p>
      <span>count: {{ count }}</span>
      <button @click="addCount">count++</button>
    </p>
  </div>
</template>
 
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import { ADD_COUNT } from './store/mutation-types';
import Logo from 'Component/Logo.vue';

@Component({
  components: {
    logo: Logo,
  },
})
export default class Hello extends Vue {
  message: string = 'Hello World';
  @State count!: number;
  @Mutation(ADD_COUNT) addCount!: Function;

  sayHello() {
    const msg: string = 'Hello World';
    window.alert(msg);
  }
}
</script>

<style lang="scss">
@import 'Asset/style/index.scss';
$theme-color: #5abebc;
.container {
  text-align: center;
  .text {
    margin: 10px 0;
    color: $theme-color;
    text-align: center;
    font-size: 40px;
    transition: all 1s;
  }
  .content {
    font-weight: bold;
    font-size: 25px;
  }
}
</style>