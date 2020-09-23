<template>
  <div class="logo-container">
    <img src="https://cn.vuejs.org/images/logo.png" />
  </div>
</template>
 
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Hello extends Vue {}
</script>

<style lang="scss">
.logo-container {
  text-align: center;
}
</style>