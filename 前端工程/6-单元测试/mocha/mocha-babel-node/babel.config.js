module.exports = (api) => {
    // Cache configuration is a required option
    api.cache(false)

    const presets = [
          "@babel/preset-typescript",
          "@babel/preset-env"
    ];
      
    return { presets };
}

/**
 * ref: https://github.com/mochajs/mocha-examples/blob/master/packages/typescript-babel/babel.config.js
 */