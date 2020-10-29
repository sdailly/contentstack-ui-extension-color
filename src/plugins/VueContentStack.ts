import {Region, Config} from "contentstack";

const contentstack = require('contentstack');

export interface IContentStackOptions {
  region: Region;
  environment: string;
  deliveryToken: string;
  apiKey: string;
}

/**
 * Fonction permettant de recuperer un content type de contentstack.
 * @param options - objet de type NuxtRuntimeConfig contenant la configuration publicRuntimeConfig et privateRuntimeConfig
 * @param locale - langue
 * @param contentType - contentType a rechercher dans la stack
 */
export default class VueContentStack {
  private stack: any;

  constructor(options: Config) {
    const {api_key, delivery_token, environment, region} = options
    this.stack = contentstack.Stack({
      api_key,
      delivery_token,
      environment,
      region,
    });
  }

  async getAllPagesEntries(locale = 'fr-fr') {
    const contentTypesPages = await this.stack.getContentTypes()
      .then(
        (result: any) => {
          return result.content_types
            .filter((contentType: any) => contentType.options.is_page === true)
        },
      );

    let arr: any = []
    for (const contentTypesPage of contentTypesPages) {
      const entryObject = await this.stack.ContentType(contentTypesPage.uid).Query()
        .language(locale)
        .toJSON()
        .find()
        .then(
          (entry: any) => {
            // console.log('entry', entry)
            return entry.flat();
          },
        )
        .catch(
          (err: any) => {
            console.error('Internal Error: contentstack: ' + err);
          },
        );
      arr.push(...entryObject);
    }
    return arr
  }
}
