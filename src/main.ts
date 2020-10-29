import Vue from 'vue';
import wrap from '@vue/web-component-wrapper/dist/vue-wc-wrapper';
import App from '@/App.vue';

const InputSearchUrlAutocomplete = wrap(Vue, App);
window.customElements.define('input-search-url-autocomplete', InputSearchUrlAutocomplete);
