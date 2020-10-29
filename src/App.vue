<template>
  <div id="app">
    <label for="input" class="App_label">Url
      <small>(with autocomplete)</small>
    </label>
    <input ref="input" id="input" class="App_field" type="search" @input="getUrlsContentStack"
           v-model="inputValue">
    <ul class="Autocomplete" v-if="autocompleteIsVisible">
      <li class="Autocomplete_item" @click="selectThisUrl(index)" v-for="(entry, index) in listUrlFiltered"
          :key="index">
        <div class="Autocomplete_itemTitle"><strong>{{entry.title}}</strong></div>
        <div class="Autocomplete_itemUrl">{{entry.url}}</div>
      </li>
    </ul>
    <p class="App_message App_message--warning" v-if="showMessageWarning">This url is not recognized by
      the list of pages in ContentStack</p>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import ContentstackUIExtension from "@contentstack/ui-extensions-sdk/dist/ui-extension-sdk.js";
  // eslint-disable-next-line no-unused-vars
  import VueContentStack, {IContentStackOptions} from "@/plugins/VueContentStack";
  // eslint-disable-next-line no-unused-vars
  import {Region} from "contentstack";

  const MIN_HEIGHT_WINDOW = 135;

  @Component({
    name: 'ChooseProducts'
  })
  export default class App extends Vue {
    public inputValue: string = '';
    private editing = false;
    private extension: any;
    private extensionField: any;
    public contentStack: any;
    private config: any;
    private listUrl: any[] = [];
    private listUrlFiltered: any[] = [];

    async mounted() {
        ContentstackUIExtension.init().then(async (extension: any) => {
          this.extension = extension;
          this.config = extension.config;
          this.extensionField = extension.field;
          this.contentStack = new VueContentStack({
            environment: 'dev',
            api_key: extension.stack._data.api_key,
            delivery_token: this.config.delivery_token,
            region: Region.EU
          });
          this.listUrl = await this.contentStack.getAllPagesEntries();

          this.inputValue = extension.field.getData().url;
          this.updateHeight();
        });
    }

    get autocompleteIsVisible(): boolean {
      return this.editing && this.urlExist
    }

    get showMessageWarning() {
      return this.inputValue.length > 0 && !this.urlExist;
    }

    get urlExist() {
      return this.listUrl.filter((entry: any) => {
        const regex = new RegExp(this.inputValue, 'i');
        return regex.test(entry.title) || regex.test(entry.url);
      }).length > 0;
    }

    async getUrlsContentStack() {
      this.listUrlFiltered = await this.listUrl.filter((entry: any) => {
        const regex = new RegExp(this.inputValue, 'i');
        this.editing = true;
        return regex.test(entry.title) || regex.test(entry.url);
      });
      this.updateHeight();
    }

    selectThisUrl(index: number = 0) {
      this.inputValue = this.listUrlFiltered[index].url;
      this.editing = false;
      this.extensionField.setData({
        url: this.inputValue,
      })
      this.updateHeight(MIN_HEIGHT_WINDOW);
    }

    updateHeight(height?: number) {
      const autoHeight: number = (height) ? height : MIN_HEIGHT_WINDOW + (this.listUrlFiltered.length * 45);
      this.extension.window.updateHeight(autoHeight);
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

    &_field {
      width: 100%;
      height: 40px;
      font-size: 14px;
      border: 1px solid #e6eced;
      color: #748590;
      padding: 8px 10px;
      background-color: #f7fbfc;
      -webkit-border-radius: 2px;
      -moz-border-radius: 2px;
      border-radius: 2px;
      background-clip: padding-box;
      outline: none;
      transition: all ease .5s;

      &:focus {
        border: 1px solid #25C2A3;
      }
    }

    &_message {
      display: block;
      padding-left: 1rem;
      border-left: 3px solid orange;
    }
  }

  .Autocomplete {
    list-style: none;
    padding: 0;

    &_item {
      padding: .5rem;
      transition: all ease .5s;

      &Title {
        font-size: 14px;
        color: #343434;
      }

      &Url {
        font-size: 12px;
        color: #52666a;
      }

      &:hover {
        background: #f6f6f6;
      }
    }
  }

</style>
