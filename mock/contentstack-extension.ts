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
        '#ef0f0f',
        '#d74f4f',
        '#0fefa1',
        '#beef0f',
    ]
  },
  field: {
    getData: () => '#ef0f0f',
    setData: (obj: any) => console.log('ajout de la valeur', obj)
  }
});
