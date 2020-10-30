const BSON = require('../BSON')

const bson = new BSON({name: 'zhangsan', age: 17})

console.log('初始化数据：', bson.data())
// [ { name: 'zhangsan', age: 17, _id: 1 } ]

console.log('添加2条数据：', bson.add([{name: 'lisi', age: 16, height: 160}, {name: 'wangwu', age: 20, height: 177}]))
// [ { name: 'zhangsan', age: 17, _id: 1 }, { name: 'lisi', age: 16, height: 160, _id: 2 }, { name: 'wangwu', age: 20, height: 177, _id: 3 } ]

console.log('查找数据：', bson.find('where name like "a"', true)) // 查找name带有a的数据
// [ { name: 'zhangsan', age: 17, _id: 1 }, { name: 'wangwu', age: 20, height: 177, _id: 3 } ]

console.log('更新数据：', bson.update({age: 18, height: 165}, 'where name = "zhangsan"'))
// [ { name: 'zhangsan', age: 18, _id: 1, height: 165 }, { name: 'lisi', age: 16, height: 160, _id: 2 }, { name: 'wangwu', age: 20, height: 177, _id: 3 } ]

console.log('根据姓名排序：', bson.sort('name').data()) // 姓名升序
// [ { name: 'lisi', age: 16, height: 160, _id: 2 }, { name: 'wangwu', age: 20, height: 177, _id: 3 }, { name: 'zhangsan', age: 18, _id: 1, height: 165 } ]

console.log('排序后分页', bson.sort('name').limit(2, true))
// [ { name: 'lisi', age: 16, height: 160, _id: 2 }, { name: 'wangwu', age: 20, height: 177, _id: 3 } ]

console.log('删除数据：', bson.delete('where name = "wangwu"'))
// [ { name: 'zhangsan', age: 18, _id: 1, height: 165 }, { name: 'lisi', age: 16, height: 160, _id: 2 } ]