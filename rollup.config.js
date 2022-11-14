import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: './src/index.js', // 入口
  output: {
    file: './dist/Minivue.js', // 出口
    name: 'Minivue', // 全局变量 global.Minivue
    format: 'umd', // esm-es6模块 commonjs-在node使用 iife-自执行函数 umd-统一模块规范（兼容amd,commonjs,iife）
    sourcemap: true, // 开启代码调试树
  },
  plugins: [
    babel({ babelHelpers: 'bundled' }), // 默认使用配置文件 .babelrc
    nodeResolve(), // import 支持导入第三方库
  ],
};
