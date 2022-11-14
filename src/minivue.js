// function Vue
// initMixin = _init 初始化
//    vm._isVue vm.$options vm._self
//    initLifecycle 初始化生命周期变量
//        vm._watcher _inactive _directInactive _isMounted _isDestroyed _isBeingDestroyed
//    initEvents 初始化事件变量
//        vm._events
//    initRender 初始化渲染变量
//        vm._vnode $slots $scopedSlots
//    beforeCreate 触发生命周期
//    initInjections（忽略）
//    initState 初始化状态变量
//        vm._watchers initProps initMethods initData initComputed initWatch
//    initProvide（忽略）
//    created 触发生命周期
//    vm.$mount()
//
// stateMixin 状态混淆
//    $data $props $watch
//
// eventsMixin 事件混淆
//
// lifecycleMixin 生命周期混淆
//    $forceUpdate $destroy
//
// renderMixin 渲染混淆
//    $nextTick _render
//
// new Vue
//    执行 init

function Minivue(options) {
  if (!(this instanceof Minivue)) {
    console.warn('Minivue 应该以 new 关键字调用!');
  }
  this._init(options);
}

initMixin(Minivue);

function initMixin(v) {
  v.prototype._init = function (options) {
    const vm = this;
    vm._isVue = true;
    vm.$options = options;
    vm._self = vm;
    vm._isMounted = false;
    vm._isDestroyed = false;

    vm.$el = typeof options.el == 'string' ? document.querySelector(options.el) : options.el;

    // beforeCreate
    if (typeof options.beforeCreate == 'function') {
      options.beforeCreate.call(this);
    }

    // initMethods
    const methods = options.methods || {};
    for (const key in methods) {
      vm[key] = typeof methods[key] == 'function' ? methods[key] : () => {};
    }

    // initData
    const data = typeof options.data == 'function' ? options.data.call(this) : options.data || {};
    vm._data = data;
    observe(vm, data);

    vm._isCreated = true;
    if (typeof options.created == 'function') {
      options.created.call(this);
    }

    vm.$updated = options.updated;

    // 初始化视图
    updateView(vm);

    vm._isMounted = true;
    if (typeof options.mounted == 'function') {
      options.mounted.call(this);
    }
  };
}

// 监听 data
function observe(vm, data) {
  // 对每个属性进行响应定义
  Object.keys(data).forEach((key) => {
    defineReactive(data, key, vm);
  });
}

// 定义响应
function defineReactive(data, key, vm) {
  // Vue2.x
  // Object.defineProperty 定义一个新属性，或者修改一个对象的现有属性
  // 重新 属性 get，set函数
  Object.defineProperty(vm, key, {
    // 读取该属性时会调用 get 函数
    get() {
      console.log(`get: ${key} - ${data[key]}`);
      return data[key];
    },
    // 写入该属性时会调用 set 函数
    set(newValue) {
      if (newValue === data[key]) return;
      console.log(`set: ${key} - ${newValue}`);
      // 值改变了
      data[key] = newValue;
      updated(key, newValue, vm);
    },
  });
}

// 监听函数
function updated(key, value, vm) {
  updateView(vm, key);
  vm.$updated.call(vm, key, value);
}

// 更新视图
function updateView(vm, key) {
  var doms = vm.$el.querySelectorAll('[v-text]');
  doms.forEach((dom) => {
    const vKey = dom.attributes['v-text'] && dom.attributes['v-text'].value;
    if (key == null) {
      dom.innerText = vm[vKey];
    } else if (vKey == key) {
      dom.innerText = vm[vKey];
    }
  });
}

export default Minivue;
