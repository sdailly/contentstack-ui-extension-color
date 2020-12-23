<template>
  <div id="app">
    <p class="App_message App_message--warning" v-if="showMessageWarning">Colors list not be loaded ! please contact
      your administrator</p>
    <ul class="App_list" v-else>
      <li class="App_item"
             :class="{'App_item--selected': colorSelected === color.value}"
             @click.prevent="setColor(color.value)"
             v-for="(color, index) in colorsList"
             :key="index">
        <span
          :style="{'background-color': color.value}"
          class="App_color">
        </span>
        <span class="App_value" v-text="color.value"></span>
        <span class="App_name" v-if="color.name" v-text="color.name"></span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import ContentstackUIExtension from "@contentstack/ui-extensions-sdk/dist/ui-extension-sdk";

  @Component({
    name: 'getColor',
  })
  export default class App extends Vue {
    public colorsList: IColor[] = [];
    public config: IConfig | undefined;
    public colorSelected = '';
    public extensionField: any;

    mounted() {
      ContentstackUIExtension.init().then((extension: any) => {
        const {config, field} = extension
        this.config = config;
        this.extensionField = field;
        this.colorsList = this.config?.colorsList || []
        this.colorSelected = field.getData();
      });
    }

    get showMessageWarning(): boolean {
      return !this.colorsList.length;
    }

    setColor(color: string) {
      this.colorSelected = (color === this.colorSelected) ? '' : color;
      this.extensionField.setData(this.colorSelected);
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
    &_list {
      display: flex;
      flex-wrap: wrap;
      padding: 0;
      margin: 0;

      & > .App_item {
        margin: 0 1rem 1rem;
      }
    }

    &_item {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;

      &--selected {
        .App_value {
          color: black;
        }

        .App_color {
          border-color: #000;
        }
      }

      &:hover {
        opacity: .8;
      }
    }

    &_color {
      display: block;
      width: 3rem;
      height: 3rem;
      background: currentColor;
      border-radius: 100%;
      border: 1px solid #fff;
      transition: all ease .25s;
    }

    &_value {
      color: #748590;
      transition: color 0.25s ease;
      font-size: .75rem;
      text-align: center;
    }

    &_name {
      color: #748590;
      transition: color 0.25s ease;
      font-size: .75rem;
      text-align: center;
    }
  }
</style>
