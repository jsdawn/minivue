import { observe } from './observe/index';

export function initState(vm) {
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  }
}

function initData(vm) {
  let data = vm.$options.data;
  data = typeof data === 'function' ? data.call(vm) : data;
  // data 指向同一个引用
  vm._data = data;
  // 观察data 对属性劫持, vue2使用 Object.defineProperty 做响应式
  observe(data);
  // 用 vm 代理 vm._data，方便vm.xx 获取数据
  proxy(vm, '_data');
}

// target 代理 source
function proxy(target, source) {
  Object.keys(target[source]).forEach((key) => {
    Object.defineProperty(target, key, {
      get() {
        return target[source][key];
      },
      set(newValue) {
        target[source][key] = newValue;
      },
    });
  });
}
