# BSON
纯前端处理JSON数据，实现增删改查，分页，排序

-------------------------------------------

### 楔子

```
因为在一个项目中，遇到一个前端负责处理一大串JSON数据，
包括增删改查分页排序等复杂操作，搞的头很大。
当时就想做一个前端BSON类，可以像mongodb一样的使用语句来处理。
趁着最近有空写了一个。基本实现了纯前端处理，没有使用缓存或者前端数据库。
还有一些可以增强的地方没有做，等以后用到再说吧
```

### 用法

* 初始化

```javascript
// @params bson, key, customKey
// 1 初始化的数据，可以是数组或者json，默认[]
// 2 关键字段，字符串类型，默认_id
// 3 关键字段是否可以编辑，Boolean类型，默认false，如果false则关键字段每次自增1
const bson = new BSON({aaa:1,bbb:2}, 'id', false)
// 可以不填默认参数，后面的方法也都是一样的
// 例：
const bson1 = new BSON({aaa:1,bbb:2}, true) // 等同于 const bson1 = new BSON({aaa:1,bbb:2}, '_id', true)
const bson2 = new BSON({aaa:1,bbb:2}) // 等同于 const bson2 = new BSON({aaa:1,bbb:2}, '_id', false)
```

* 添加数据

```javascript
// @method: add
// @params bson
// 要添加的数据，可以是数组或json, 默认[]
// @returns bson 添加后的所有数据
bson.add([{aaa:2,ccc:5},{aaa:3,bbb:7},{ddd:2,bbb:3}])
```

* 删除数据

```javascript
// @method: delete
// @params where 
// where语句：字符串类型，默认''，则删除全部数据。where语法：where关键字开头，不区分大小写 字段 运算符 值，运算符包括（=,<=,>=,<>,!=,like）(and, &&, or, ||)例：'where _id = 2' 'where _id < 3 and aaa < 2'
// TODO 括号运算符没有做 'where _id = 2 && (aaa like "zhangsan" or bbb <> 2)'
// @returns bson 删除后的所有数据
bson.delete('where _id = 2')
```

* 更新数据

```javascript
// @method: update
// @params set, where
// set语句: 要更新的数据 json格式
// where 参考删除 where语句
// @returns bson 更新后的所有数据
bson.update({aaa: 'zhangsan', ccc: 21},'where _id = 2')
```

* 查找数据

```javascript
// @method: find
// @params item, where, returnType
// item: 查找的字段，字符串类型。默认'*'查找全部字段，如果多个字段，用,分割，例：'aaa, bbb, ccc'
// where 参考删除 where语句
// returnType: Boolean类型。默认false。如果true则返回查找后的数据，false返回自身BSON对象，方便继续进行操作，
// 例 bson.find('where _id < 5').sort('_id desc') 返回_id<5的数据，然后根据_id字段降序排序
// 如果操作完毕希望输出数据可以2种方式 bson.find('where _id < 5').sort('_id desc', true) 或者 bson.find('where _id < 5').sort('_id desc').data() 当最后的操作returnType为true直接返回数据，或者用.data()方法直接返回查询后的数据
bson.find('WHERE _id > 2 OR aaa like "zhangsan"')
```

* 排序

```javascript
// @method: sort
// @params order, returnType
// order排序语句，字符串类型。默认'_id'
// order语法：字段 排序方式，如果多个的话用,分割，排序方式desc降序，asc升序，默认asc 例bson.sort('_id desc, aaa') _id降序排列，当_id一致时，按aaa升序排列，以此类推
// returnType: 参考查找的returnType
bson.sort('_id desc, aaa')
```

* 分页

```javascript
// @method: limit
// @params start, offset, returnType
// start 起始位置，数值类型，默认0
// offset: pagesize每页条数，默认-1, 全部
// returnType: 参考查找的returnType
bson.limit(10) // 等同于bson.limit(0, 10)
```

* 数据

```javascript
// @method: data, toString
// @params 无
// @returns data 返回正在操作的数据，数组类型；toString 返回所有数据的string格式，字符串类型
bson.data()
bson.toString() //方便使用到本地缓存中
```

### 结语

基本实现了纯前端的数据操作，括号运算符和一些sum count group等等常见数据表运算没有做。前端用应该差不多了
如果有必要的话，以后再做个npm包。先这样了吧
