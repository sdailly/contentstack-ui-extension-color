<template>
  <div id="app">
    <p class="App_message App_message--warning" v-if="showMessageWarning">Colors list not be loaded ! please contact
      your administrator</p>
    <div class="App_list" v-else>
      <label class="App_item"
             :class="{'App_item--selected': colorSelected === color}"
             @click="setColor(color)"
             v-for="(color, index) in colorsList"
             :key="index">
        <input hidden v-model="colorSelected" :value="color" type="radio" class="App_input" />
        <span
          :style="{'background-color': color}"
          class="App_color">
        </span>
        <span class="App_value" v-text="color"></span>
      </label>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import ContentstackUIExtension from "@contentstack/ui-extensions-sdk/dist/ui-extension-sdk";

  @Component({
    name: 'getColor',
  })
  export default class App extends Vue {
    public colorsList: string[] = [];
    public config: IConfig | undefined;
    public colorSelected: string = '';
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

    setColor(color: any) {
      this.extensionField.setData(color);
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

      & > .App_item {
        margin: 0 1rem 1rem;
      }
    }

    &_item {
      display: inline-block;
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
      display: block;
      color: #748590;
      transition: color 0.25s ease;
    }
  }
</style>
