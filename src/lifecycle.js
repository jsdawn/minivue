import { createElementVNode, createTextVNode } from './vdom';

// 虚拟 dom 生成 真实 dom
function createElm(vnode) {
  let { tag, data, children, text } = vnode;
  if (tag) {
    let tagElm = document.createElement(tag);
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        tagElm.setAttribute(key, data[key]);
      }
    }
    children.forEach((child) => {
      tagElm.appendChild(createElm(child));
    });

    vnode.el = tagElm;
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

// 处理真实dom与虚拟dom
function patch(elm, vnode) {
  if (elm.nodeType) {
    // elm 是真实元素
    const parentElm = elm.parentNode;
    const newElm = createElm(vnode);
    parentElm.insertBefore(newElm, elm.nextSibling);
    parentElm.removeChild(elm);

    return newElm;
  } else {
  }
}

export function initLifecycle(Vue) {
  // 虚拟dom 更新到 真实dom
  Vue.prototype._update = function (vnode) {
    const vm = this;
    vm.$el = patch(vm.$el, vnode);
  };

  // 虚拟dom - 创建元素
  Vue.prototype._c = function () {
    return createElementVNode(this, ...arguments);
  };
  // 虚拟dom - 创建文本
  Vue.prototype._v = function () {
    return createTextVNode(this, ...arguments);
  };
  // 虚拟dom - 处理变量
  Vue.prototype._s = function (value) {
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return value;
  };

  // 渲染，属性与视图结合，产生虚拟dom
  // 虚拟dom：与 ast 语法树相似，更趋向于存放所需数据
  Vue.prototype._render = function () {   
    const vm = this;
    let vnode = vm.$options.render.call(vm);
    return vnode;
  };
}

export function mountComponent(vm, el) {
  vm.$el = el;
  // 1.调用render方法 产生虚拟 dom
  let vnode = vm._render();
  // 2.根据虚拟dom 创建真实 dom
  vm._update(vnode);
}
