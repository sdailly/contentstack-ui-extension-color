import {mount, Wrapper} from '@vue/test-utils'
import App from "@/App.vue";

let wrapper: Wrapper<App & { [key: string]: any }>;

describe('ColorSelect.vue', () => {
  function mountWrapper(options?: any) {
    return mount(App, {
      ...options,
    });
  }

  beforeAll(() => {
    process.env.MOCK = undefined;
  })

  beforeEach(() => {
    wrapper = mountWrapper();
  })

  afterEach(() => {
    wrapper.destroy();
  })

  describe('Init Component - default fn', () => {

    describe("Message d'erreur", () => {
      test("le message d'erreur ne s'affiche pas si la liste de couleur est remplis", () => {
        wrapper = mountWrapper({
          data: () => ({
            colorsList: [
              '#ef0f0f',
              '#d74f4f',
              '#0fefa1',
              '#beef0f',
            ] as string[],
            extensionField: {
              setData: () => jest.fn(),
            }
          })
        });
        expect(wrapper.vm.showMessageWarning).toBe(false);
        expect(wrapper.find('.App_list').exists()).toBe(true);
      });
      test("Un message d'erreur s'affiche si la liste des couleurs n'est pas définies", () => {
        expect(wrapper.vm.colorsList).toEqual([]);
        expect(wrapper.vm.showMessageWarning).toBe(true);
      });
    });

    test("le nombre d'element .App_item devrait retourner 5", () => {
      wrapper = mountWrapper({
        data: () => ({
          colorsList: Array(5).fill('#ef0f0f'),
          extensionField: {
            setData: () => jest.fn(),
          }
        }),
      });
      expect(wrapper.element.querySelectorAll('.App_item').length).toBe(5);
    });

    test('la valeur des inputs devraient retourner la valeur de la couleur', () => {
      wrapper = mountWrapper({
        data: () => ({
          extensionField: {
            setData: () => jest.fn(),
          },
          colorsList: [
            '#ef0f0f',
            '#52ef0f',
          ]
        }),
      });
      const firstInput = wrapper.find('.App_input').attributes('value')
      expect(firstInput).toBe('#ef0f0f');
    });

    test('App_color valeur par défaut doit être vide', () => {
      wrapper = mountWrapper({
        data: () => ({
          extensionField: {
            setData: () => jest.fn(),
          },
          colorsList: [
            '#ef0f0f',
            '#52ef0f',
          ]
        }),
      });
      expect(wrapper.element.querySelector('.App_color')?.getAttribute('style')).toBe('background-color: rgb(239, 15, 15);');
    });
  });

  describe("A la selection d'une couleur", () => {
    beforeEach(() => {
      wrapper = mountWrapper({
        data: () => ({
          extensionField: {
            setData: jest.fn(),
            getData: () => '',
          },
          colorsList: [
            '#ef0f0f',
            '#52ef0f',
          ]
        }),
      });
    })
    test('La valeur sélectionnée devrait être le rouge', async () => {
      wrapper.vm.setColor = jest.fn();
      const firstInput = wrapper.find('.App_item');
      await firstInput.trigger('click');
      expect(wrapper.vm.setColor).toHaveBeenCalled();
      expect(wrapper.vm.colorSelected).toBe('#ef0f0f');
    });

    test('la fonction setColor doit être appelée ', async () => {
      wrapper.vm.setColor = jest.fn();
      const firstInput = wrapper.find('.App_item');
      await firstInput.trigger('click');
      expect(wrapper.vm.setColor).toHaveBeenCalled();
    });

    test('La valeur sélectionnée devrait être le vert', async () => {
      const firstInput = wrapper.findAll('.App_item').at(1);
      await firstInput.trigger('click');
      expect(wrapper.vm.colorSelected).toBe('#52ef0f');
    });

    test('La classe "--selected" doit être présente sur l élément sélectionné', async () => {
      const firstInput = wrapper.findAll('.App_item').at(0);
      await firstInput.trigger('click');
      expect(firstInput.classes().includes('App_item--selected')).toBe(true);
    });
  });
  describe('Retour de ContentStack', () => {
    test('la couleur sélectionnée devrait être vide si CS remonte une valeur vide', () => {
      expect(wrapper.vm.colorSelected).toBe('');
    });
    test('la valeur de colorSelected devrait retourner la valeur saisie dans ContentStack', () => {
      wrapper = mountWrapper({
        data: () => ({
          extensionField: {
            getData: () => '#52ef0f',
            setData: jest.fn(),
          },
          colorsList: [
            '#ef0f0f',
            '#52ef0f',
          ]
        }),
      });
      expect(wrapper.vm.extensionField.getData()).toBe('#52ef0f');
    });
  });
});
