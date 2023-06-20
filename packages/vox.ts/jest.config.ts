const nodeModulesToTranspile = ['@babylonjs'];

export default {
  roots: ['src'],
  transformIgnorePatterns: [`node_modules/(?!(${nodeModulesToTranspile.join('|')})/)`, '<rootDir>/build/.*\\.js'],
  testMatch: ['**/*\\.(spec|test)\\.(ts|js|tsx|jsx)'],
  collectCoverageFrom: ['src/**/*.(ts|tsx)', '!out/', '!build/', '!**/node_modules', '!/coverage'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  coverageReporters: ['json', 'lcov', 'text', 'html'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/mocks/resolves-to-path.json',
    '\\.(css|less|scss|sass)$': '<rootDir>/test/mocks/resolves-to-path.json',
  },
  transform: {
    ['^.+\\.(ts|tsx|js|jsx)$']: ['@swc/jest'],
  },
};
