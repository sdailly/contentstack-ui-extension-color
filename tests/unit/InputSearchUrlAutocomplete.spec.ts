import { mount, Wrapper } from '@vue/test-utils'
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
  },
  extensionField: ({
    setData: () => jest.fn(),
  }),
};

describe('InputSearchUrlAutocomplete.vue', () => {
  function getWrapper(options?: any) {
    return mount(App, {
      mocks: defaultMocks,
      ...options,
    });
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

    test('listFilteredByQuery should be return empty array', () => {
      expect(wrapper.vm.listFilteredByQuery).toEqual([]);
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
    beforeEach(() => {
      wrapper = getWrapper();
      wrapper.vm.listUrl = wrapper.vm.contentStack.getAllPagesEntries();
    })
    afterEach(() => {
      wrapper.destroy();
    })

    test('focus on input, editing value should be return true', async () => {
      const input = wrapper.find('.App_field');
      input.trigger('focus');
      expect(wrapper.vm.editing).toBe(true);
    });

    test('When i set Promod on input, Query should be return "Promod"', async () => {
      const input = wrapper.find('.App_field');
      input.setValue('Promod');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.inputValue).toBe('Promod');
    });

    test('Devrait retourner 2 résultats contenant un P dans le titre', async () => {
      const input = wrapper.find('.App_field');
      await input.trigger('keypress');
      input.setValue('Promod');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.listFilteredByQuery.length).toBe(2);
      expect(wrapper.vm.listFilteredByQuery[0].title).toBe('Promod');
    });

    test('Devrait retourner 2 résultats contenant un p minuscule dans le titre', async () => {
      const input = wrapper.find('.App_field');
      await input.trigger('input');
      await input.setValue('promo')
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.listFilteredByQuery.length).toBe(2);
      expect(wrapper.vm.listFilteredByQuery[0].title).toBe('Promod');
    });

    test('Les informations sont envoyées à ContentStack', async () => {
      const input = wrapper.find('.App_field');
      await input.trigger('focus');
      await input.setValue('Pr');
      const itemsSuggest = wrapper.findAll('.Autocomplete_item');
      const selectThisUrl = jest.spyOn(wrapper.vm, 'selectThisUrl');
      const setData = jest.spyOn(wrapper.vm.extensionField, 'setData');
      const updateHeight = jest.spyOn(wrapper.vm, 'updateHeight');
      const secondItemSuggest = itemsSuggest.at(1);
      await secondItemSuggest.trigger('click');
      await wrapper.vm.$nextTick();

      expect(selectThisUrl).toHaveBeenCalledWith(1);
      expect(setData).toHaveBeenCalledWith({
        url: (input.element as HTMLInputElement).value,
      });
      expect(updateHeight).toHaveBeenCalled();
    });
  });
});
