import { compileToFunction } from './compiler/index';
import { mountComponent } from './lifecycle';
import { initState } from './state';

export function initMixin(Vue) {
  // 初始化
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;

    // 初始化状态
    initState(vm);

    // 数据挂载，有 根元素 el 则直接挂载
    if (options.el) {
      vm.$mount(options.el);
    }
  };

  // 数据挂载函数
  Vue.prototype.$mount = function (el) {
    const vm = this;
    el = document.querySelector(el);
    const opts = vm.$options;

    // 1.没有 render 函数，则将模版转换成 render
    if (!opts.render) {
      let template = opts.template;
      if (!template && el) {
        template = el.outerHTML;
      }
      if (template) {
        opts.render = compileToFunction(template); // 编译模版为 render 函数
        console.log(opts.render);
      }
    }

    // 2.挂载
    mountComponent(vm, el);
  };
}
