// 重写部分数组方法
let oldArrayProto = Array.prototype;
let newArrayProto = Object.create(oldArrayProto);

let methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];

methods.forEach((method) => {
  newArrayProto[method] = function (...args) {
    // do something...
    console.info(`method: ${method} - ${args}`);
    // arr.push：this.指向 arr， 把 this 传递过去
    let result = oldArrayProto[method].call(this, ...args);

    let inserted;
    let ob = this.__ob__; // Observe
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice': // arr.slice(2,1,{a:1},'b')
        inserted = args.slice(2); // 获取后面的参数
        break;
      default:
        break;
    }

    if (inserted) {
      // 监听数组，args 为数组
      ob.observeArray(inserted);
    }

    return result;
  };
});

export default newArrayProto;
