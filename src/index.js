import { initMixin } from './init';
import { initLifecycle } from './lifecycle';

function Minivue(options) {
  if (!(this instanceof Minivue)) {
    console.warn('Minivue 应该以 new 关键字调用!');
  }
  this._init(options);
}

console.info = (str) => {
  return console.log(`%c${str}`, 'color:green');
};

initMixin(Minivue);
initLifecycle(Minivue);

export default Minivue;

// vue 的核心流程
// 1. 创造响应式数据
// 1. 模版转换 ast 语法树
// 1. ast 语法树转换为 render 函数
// 1. 数据更新后 只需执行 render，render函数根据  数据生成虚拟 dom
// 1. 根据虚拟 dom 创建真实 dom
