// _c() h()
export function createElementVNode(vm, tag, props, ...children) {
  if (!props) props = {};
  return vNode(vm, tag, props.key, props, children);
}

// _v()
export function createTextVNode(vm, text) {
  return vNode(vm, null, null, null, null, text);
}

function vNode(vm, tag, key, data, children, text) {
  return {
    vm,
    tag,
    key,
    data,
    children,
    text,
  };
}
