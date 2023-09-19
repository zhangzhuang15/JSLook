(function(modules) {
    return requireModuleId(1);

    function requireModuleId(moduleId) {
        const mod = modules[moduleId];
        const loadFn = mod[0];
        const mapping = mod[1];

        const module = {
            exports: {},
        };

        loadFn(requireModuleString.bind(null, mapping), module, module.exports);
            
        return module.exports;
    }

    function requireModuleString(mapping, moduleString) {
        const moduleId = mapping[moduleString];
        return requireModuleId(moduleId);
    }

})({ 
  1: [
      function(require, module, exports) {
          "use strict";

var _data = _interopRequireDefault(require("./data.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// simple example that imports other module
function main() {
  _data["default"].hello();
  return 0;
}
main();
      },
      {"./data.js":2}
  ],

  2: [
      function(require, module, exports) {
          "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  name: "JasonZhang",
  msg: "hello world",
  hello: function hello() {
    console.log(this.msg);
  }
};
exports["default"] = _default;
      },
      {}
  ],
 })