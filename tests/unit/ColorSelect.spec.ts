import {mount, Wrapper} from '@vue/test-utils'
import App from "@/App.vue";

let wrapper: Wrapper<App & { [key: string]: any }>;

describe('ColorSelect.vue', () => {
  function mountWrapper(options?: any) {
    return mount(App, {
      ...options,
    });
  }

  beforeEach(() => {
    wrapper = mountWrapper();
  })

  afterEach(() => {
    wrapper.destroy();
  })

  describe('Init Component - default fn', () => {
    test("le message d'erreur ne s'affiche pas si la liste de couleur est remplis", () => {
      wrapper = mountWrapper({
        data: () => ({
          colorsList: [{
            label: 'red',
            hex: '#ef0f0f',
          }] as colorsList[]
        })
      });
      expect(wrapper.vm.showMessageWarning).toBe(false);
      expect(wrapper.find('.App_list').exists()).toBe(true);
    });

    test("Un message d'erreur s'affiche si la liste des couleurs n'est pas définies", () => {
      expect(wrapper.vm.colorsList).toBe(undefined);
      expect(wrapper.vm.showMessageWarning).toBe(true);
    });

    test("le nombre d'element .App_item devrait retourner 5", () => {
      wrapper = mountWrapper({
        data: () => ({
          colorsList: Array(5).fill({
            label: 'red',
            hex: '#ef0f0f',
          })
        }),
      });
      expect(wrapper.element.querySelectorAll('.App_item').length).toBe(5);
    });

    test('la valeur par défaut doit être vide', () => {
      expect(wrapper.vm.colorSelected).toBe('');
    });

    test('la valeur par défaut doit être vide', () => {
      expect(wrapper.vm.colorSelected).toBe('');
    });

    test('App_color valeur par défaut doit être vide', () => {
      wrapper = mountWrapper({
        data: () => ({
          colorsList: [{
            label: 'red',
            hex: '#ef0f0f',
          }]
        }),
      });
      expect(wrapper.element.querySelector('.App_item')?.getAttribute('style')).toBe('color: rgb(239, 15, 15);');
    });

    test('La valeur sélectionnée devrait être le rouge', async () => {
      wrapper = mountWrapper({
        data: () => ({
          colorsList: [{
            label: 'red',
            hex: '#ef0f0f',
          }]
        }),
      });
      const firstInput = wrapper.find('.Color_value');
      await firstInput.trigger('click');
      expect(wrapper.vm.colorSelected).toBe('#ef0f0f');
    });

    test('La valeur sélectionnée devrait être le vert', async () => {
      wrapper = mountWrapper({
        data: () => ({
          colorsList: [
            {
              label: 'red',
              hex: '#ef0f0f',
            },
            {
              label: 'vert',
              hex: '#52ef0f',
            }
          ]
        }),
      });
      const firstInput = wrapper.findAll('.Color_value').at(1);
      await firstInput.trigger('click');
      expect(wrapper.vm.colorSelected).toBe('#52ef0f');
    });
  });
});
