import Vue from 'vue';
import wrap from '@vue/web-component-wrapper/dist/vue-wc-wrapper';
import App from '@/App.vue';

const Color = wrap(Vue, App);
window.customElements.define('get-color', Color);
