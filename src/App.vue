<template>
  <div id="app">
    <p class="App_message App_message--warning" v-if="showMessageWarning">Colors list not be loaded ! please contact your administrator</p>
    <ul class="App_list" v-else>
      <li class="App_item" :style="{color: color.hex}" v-for="(color, index) in colorsList" :key="index">
        <input v-model="colorSelected" :value="color.hex" type="radio" class="Color_value" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import ContentstackUIExtension from "@contentstack/ui-extensions-sdk/dist/ui-extension-sdk.js";

  @Component({
    name: 'ColorsSelect',
  })
  export default class App extends Vue {
    public extensionField: any;
    public colorsList: colorsList[] | undefined;
    public config: IConfig | undefined;
    public colorSelected: colorsList | '' = '';

    mounted() {
      ContentstackUIExtension.init().then((extension: any) => {
        const {config, field} = extension
        this.config = config;
        this.extensionField = field;
        this.colorsList = this.config?.colorsList
        this.colorSelected = extension.field.getData().colorSelected;
      });
    }

    get showMessageWarning(): boolean {
      return !this.colorsList;
    }
  }
</script>

<style lang="scss">
  #app {
    font-family: proximaNovaRegular, Arial, Helvetica, Sans-Serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .App {
    &_label {
      font-size: 14px;
      margin-bottom: 8px;
      display: block;
      font-weight: 400;
    }

    &_list {
    }

    &_item {
    }

    &_value {
    }
  }
</style>
