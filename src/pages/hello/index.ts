import Vue from 'vue';
import store from './store';
import App from './hello.vue';

new Vue(
  {
    el: '#app',
    store,
    render: h => h(App)
  }
);
