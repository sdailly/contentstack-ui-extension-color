import {mount, Wrapper} from '@vue/test-utils'
import App from "@/App.vue";
import mockEntries from '../__mocks__/getAllPagesEntries.mock';

let wrapper: Wrapper<App & { [key: string]: any }>;
let defaultMocks = {
  ContentstackUIExtension: {
    init: () => Promise.resolve({
      field: {
        getData: () => ({
          url: ''
        })
      }
    })
  },
  contentStack: {
    getAllPagesEntries: () => mockEntries
  },
  updateHeight: () => jest.spyOn(wrapper.vm, 'updateHeight'),
  extension: {
    window: {
      updateHeight: () => jest.fn(),
    }
  }
};

describe('InputSearchUrlAutocomplete.vue', () => {
  function getWrapper(options?: any) {
    const wrapperMounted = mount(App, {
      mocks: defaultMocks,
      ...options,
    });
    // @ts-ignore
    return wrapperMounted
  }

  beforeAll(() => {
    wrapper = getWrapper();
  })

  afterAll(() => {
    wrapper.destroy();
  })

  describe('Init Component - default fn', () => {
    test('inputValue should be return empty string', () => {
      expect(wrapper.vm.inputValue).toBe('');
    });

    test('Editing mode should be return false', () => {
      expect(wrapper.vm.editing).toBe(false);
    });

    test('listUrl should be return empty array', () => {
      expect(wrapper.vm.listUrl).toEqual([]);
    });

    test('listUrlFiltered should be return empty array', () => {
      expect(wrapper.vm.listUrlFiltered).toEqual([]);
    });

    test('Autocomplete should be not visible', () => {
      expect(wrapper.vm.autocompleteIsVisible).toBe(false);
      expect(wrapper.find('.Autocomplete').exists()).toBe(false);
    });

    test('Message warning should be not visible', () => {
      expect(wrapper.vm.showMessageWarning).toBe(false);
      expect(wrapper.find('.App_message').exists()).toBe(false);
    });
  });

  describe('Recherche une url', () => {
    beforeAll(() => {
      wrapper.vm.listUrl = wrapper.vm.contentStack.getAllPagesEntries();
    })
    test('When i set Promod on input, Query should be return "Promod"', async () => {
      const input = wrapper.find('.App_field');
      input.setValue('Promod');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.inputValue).toBe('Promod');
    });

    test('Devrait me retourner 2 résultats contenant un P dans le titre', async () => {
      wrapper.vm.getUrlsContentStack = jest.spyOn(wrapper.vm, 'getUrlsContentStack');
      const input = wrapper.find('.App_field');
      await input.trigger('input');
      await input.setValue('Pr')
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.getUrlsContentStack).toHaveBeenCalled();
      expect(wrapper.vm.listUrlFiltered.length).toBe(2);
      expect(wrapper.vm.listUrlFiltered[0].title).toBe('Promod');
    });

    describe("Quand je sélectionne une url proposée dans l'autcompletion", () => {
      test('Les informations sont envoyées à ContentStack', async () => {
        wrapper = getWrapper({
          mocks: {
            ...defaultMocks,
            extensionField: ({
              setData: () => jest.fn(),
            }),
          },
        });
        wrapper.vm.listUrl = wrapper.vm.contentStack.getAllPagesEntries();
        const input = wrapper.find('.App_field');
        await input.trigger('input');
        await input.setValue('Pr');
        const itemsSuggest = wrapper.findAll('.Autocomplete_item');
        const selectThisUrl = jest.spyOn(wrapper.vm, 'selectThisUrl');
        const setData = jest.spyOn(wrapper.vm.extensionField, 'setData');
        const updateHeight = jest.spyOn(wrapper.vm, 'updateHeight');
        const secondItemSuggest = itemsSuggest.at(1);
        await secondItemSuggest.trigger('click');
        await wrapper.vm.$nextTick();

        expect(selectThisUrl).toHaveBeenCalledWith(1);
        expect(setData).toHaveBeenCalled();
        expect(updateHeight).toHaveBeenCalled();
      });
    });
  });
});
