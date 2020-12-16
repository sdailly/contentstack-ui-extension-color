class contentstackUIExtension {
  private readonly mock: any;

  constructor(extension: any) {
    this.mock = extension;
  }

  public init() {
    return Promise.resolve(this.mock);
  }
}

export default new contentstackUIExtension({
  config: {
    colorsList: [
      {
        name: 'test',
        value: '#ef0f0f',
      },
      {
        name: '',
        value: '#52ef0f',
      },
    ]
  },
  field: {
    getData: () => '#ef0f0f',
    setData: (obj: any) => console.log('ajout de la valeur', obj)
  }
});
