import { parseDocument } from 'htmlparser2';

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配表达式 {{ name }}
// 对模版进行编译，返回 render
// 1.将 template 转化为 ast 语法树
// 2.生成 render 方法（返回 虚拟dom）
export function compileToFunction(template) {
  // 1.将 template 转化为 ast 语法树
  let ast = parseHtml(template);

  // 2.生成 render 方法（返回 虚拟dom）
  // 模版引擎的实现原理 with + new Function
  // with(this){ return code }
  ast = ast.children ? ast.children[0] : null; // 获取根元素
  console.log(ast);
  const code = codegen(ast);
  return new Function(`with(this){ return ${code} }`);
}

// 解析 html 为 ast
function parseHtml(html) {
  // 这里本身使用 正则 去解析：
  // onopentag/ontext/onclosetag，标签名、属性 key-value、文本
  // (这里使用代替方案 htmlparser2 的 parseDocument)
  return parseDocument(html);
}

// 拼接 tag
// _c(tag,props,child1,child2...) 标签元素函数
// _s(name)  变量函数
// _v(str) 文本函数
function codegen(ast) {
  if (!ast) return '';
  const tag = ast.name;
  const props = genProps(ast.attribs);
  const children = ast.children.length ? genChildren(ast.children) : null;

  const code = `_c('${tag}',${props},${children})`;
  return code;
}

// 拼接 props
// {a:'a',b:'b',c:'c'}
function genProps(attrs) {
  let str = '';
  Object.keys(attrs).forEach((key) => {
    let value = attrs[key];
    str += `,${key}:"${value}"`;
  });
  return str ? `{${str.slice(1)}}` : null;
}

// 单个 child
function gen(node) {
  // 标签元素
  if (node.type === 'tag') {
    return codegen(node);
  }
  // 文本： 这里是{{ message }}文本 => _v('这里是' + _s(message) + '文本')
  if (node.type === 'text') {
    let text = node.data;
    let match;
    let buffer = [];
    defaultTagRE.lastIndex = 0;
    let lastIndex = 0; // 匹配完最后的位置

    do {
      match = defaultTagRE.exec(text); // match.index 匹配到的位置
      // 匹配到变量
      if (match) {
        if (match.index > lastIndex) {
          let s = text.slice(lastIndex, match.index);
          buffer.push(JSON.stringify(s));  // '这里是'
        }
        buffer.push(`_s(${match[1].trim()})`); // ‘_s(message)’
        lastIndex = match.index + match[0].length;
      }
    } while (match);

    // 匹配末尾有文字
    if (lastIndex < text.length) {
      buffer.push(JSON.stringify(text.slice(lastIndex))); // '文本'
    }

    // _v('这里是' + _s(message) + '文本')
    if (buffer.length > 0) {
      return '_v(' + buffer.join('+') + ')';
    }
  }
}

// 拼接 children
function genChildren(children) {
  let childs = [];
  children.forEach((child) => {
    const str = gen(child);
    if (str) childs.push(str);
  });

  return childs.length > 0 ? childs.join(',') : null;
}

/**
(function anonymous() {
  with (this) {
    return _c(
      'div',
      { id: 'app', class: 'wrapper', style: 'color: orange' },
      _c(
        'h1',
        { class: 'title', style: 'color: red; font-size: 40px' },
        _v('\n        标题 ' + _s(title) + '\n      ')
      ),
      _c(
        'span',
        null,
        _v('这里是 ' + _s(message) + ' 文本 ' + _s(brief) + ' 末尾')
      ),
      _c('p', null, _v('纯文本')),
    );
  }
});
 */
