// eslint-disable-next-line no-undef
const mockAxios = jest.genMockFromModule('axios')

// eslint-disable-next-line no-undef
mockAxios.create = jest.fn(() => mockAxios)

export default mockAxios
