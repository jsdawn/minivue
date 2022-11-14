import newArrayProto from './array';

class Observe {
  constructor(data) {
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false, // 不可枚举，隐藏属性
    });
    // 如果是数组，不劫持索引，只劫持引用项的属性
    if (Array.isArray(data)) {
      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }

  walk(data) {
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]));
  }

  observeArray(data) {
    // 通过重写数组原型方法监听数据自身改变
    data.__proto__ = newArrayProto;
    // 监听数组项
    data.forEach((item) => observe(item));
  }
}

// 定义响应
export function defineReactive(target, key, value) {
  // 如果value 还是对象，继续劫持
  observe(value);
  // 把 属性 转换为 getter/setter
  // 这里是闭包的知识，value 为闭包变量 let value = xx
  // set：修改 value，get获取了新的 value
  Object.defineProperty(target, key, {
    get() {
      console.info(`get: ${key} - ${value}`);
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      value = newValue;
      console.info(`set: ${key} - ${value}`);
    },
  });
}

// 观察 data，劫持属性并响应式
export function observe(data) {
  if (typeof data !== 'object' || data === null) return;
  if (data.__ob__ instanceof Observe) return data.__ob__;

  return new Observe(data);
}
