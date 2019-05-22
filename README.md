This app has been configured with the following steps:

1. Add the following `postinstall` script:
  ```
  yarn rn-nodeify --install url,events,https,http,util,stream,crypto,vm,buffer --hack --yarn
  ```
2. `yarn add -D rn-nodeify`
4. Uncomment `require('crypto')` on shim.js
5. `react-native link react-native-randombytes`
6. Create file `rn-cli.config.js`
  ```
  module.exports = {
    resolver: {
      extraNodeModules: require("node-libs-react-native"),
    },
  };
  ```
7. Add `import "./shim";` to the top of `index.js`
8. `yarn add stellar-sdk`
