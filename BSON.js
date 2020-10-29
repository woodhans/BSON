/*! BSON: handle frontend json data like mongodb
 *  author by hans.wu hans.wu@hanswu.com
 *  version 0.1 2018-09-09
 */

/*
 * @class BSON
 * @param bson: Array|JSON, bson data default []
 * @param key: String, bson key item default '_id'
 * @param customKey: Boolean, default false, if false, key item will auto increase 1 and can't edit whenever; else key item will random 32 string and u can edit when constructor or insert
 */
class BSON {
  // private variable
  #bson = [];
  #key = '_id';
  #hasKey = !1;
  #_bson;
  #length = 0;
  #return = !1;
  constructor(bson = [], key = '_id', customKey = !1) {
    let _bson = Array.isArray(bson) ? bson : typeof bson === 'object' && Object.prototype.toString.call(bson).toLowerCase() === '[object object]' && !bson.length ? [bson] : () => {
      throw new Error('Type Error: BSON Data only accept Array or JSON format')
    }
    this.#key = typeof key === 'string' ? ((/^[a-zA-Z_][a-zA-Z0-9_]{0,14}[a-zA-Z0-9]$/).test(key) ? key : () => {
      throw new Error('Key Error: BSON Key Item must be 2~16 length, english characters, numbers and _')
    }) : typeof key === 'boolean' ? '_id' : () => {
      throw new Error('Type Error: BSON Key Item only accept String format')
    }
    this.#hasKey = typeof key === 'boolean' ? key : !!customKey
    _bson.forEach((data, index) => {
      if (this.#hasKey) {
        data[this.#key] = data[this.#key] || this.#generateKey()
      } else {
        data[this.#key] = index + 1
      }
    })
    this.#bson = _bson
    this.#length = _bson.length
  }
  // public method
  toString() {
    try {
      this.#_bson = undefined
      return JSON.stringify(this.#bson)
    } catch (err) {
      throw new Error(err)
    }
  }
  add(bson) {
    let _bson = Array.isArray(bson) ? bson.concat() : typeof (bson) === 'object' && Object.prototype.toString.call(bson).toLowerCase() === '[object object]' && !bson.length ? [bson] : () => {
      throw new Error('Type Error: Insert BSON Data only accept Array or JSON')
    }
    _bson.forEach((data, index) => {
      if (this.hasKey) {
        data[this.#key] = data[this.#key] || this.#generateKey()
      } else {
        data[this.#key] = (() => {
          return index + 1 + this.#bson[this.#bson.length - 1][this.#key]
        })()
      }
    })
    this.#bson = this.#bson.concat(_bson)
    this.#_bson = undefined
    this.#length = this.#bson.length
    return this.#bson
  }
  delete(where = '') {
    if (where !== '') {
      if (this.#bson.length > 0) {
        this.#bson.forEach((data, index) => {
          if (this.#where(data, where)) {
            this.#bson.splice(index, 1)
          }
        })
      }
    } else {
      if (confirm('您没有设置删除条件，将清空整个BSON数据，确定要如此吗？')) this.#bson = []
    }
    return this.#bson
  }
  update(set = '', where = '') {
    if (typeof (set) === 'object' && Object.prototype.toString.call(set).toLowerCase() === '[object object]' && !set.length) {
      if (this.#bson.length > 0) {
        this.#bson.forEach((data, index) => {
          if (where !== '') {
            if (this.#where(data, where)) {
              this.#bson[index] = {
                ...data,
                ...set
              }
            }
          } else {
            this.#bson[index] = {
              ...data,
              ...set
            }
          }
        })
      }
      return this.#bson
    } else {
      throw new Error('update sentence error!')
    }
  }
  find(item = '*', where = '', ret = this.#return) {
    let _item = typeof item === 'string' ? /^(where)/i.test(item) ? '*' : item === '*' ? item : item.split(',') : Array.isArray(item) ? item : '*'
    let _where = typeof item === 'string' && /^(where)/i.test(item) ? item : typeof item === 'boolean' || typeof where === 'boolean' ? '' : typeof item === 'where' && /^(where)/i.test(where) ? where : ''
    let _ret = typeof item === 'boolean' ? item : typeof where === 'boolean' ? where : ret
    let _bson = []
    let _current = this.#currentBson()
    if (_current.length > 0) {
      let assembleData = (c) => {
        _item === '*' ? _bson.push(c) : () => {
          // 拼一下数据，push进_bson
          let _data = {}
          _item.map(tem => {
            _data[tem] = c[tem] || null
          })
          _bson.push(_data)
        }
      }
      _current.forEach(data => {
        if (_where !== '') {
          if (this.#where(data, _where.replace(/where /i, ' '))) {
            assembleData(data)
          }
        } else {
          assembleData(data)
        }
      })
    }
    this.#_bson = _bson
    this.#length = _ret ? this.#bson.length : _bson.length
    return _ret ? this.data() : this
  }
  sort(sort = this.#key, ret = this.#return) {
    let _sort = typeof sort !== 'string' ? this.#key : sort
    let _ret = typeof sort === 'boolean' ? sort : ret
    this.#_bson = this.#sort(_sort)
    this.#length = _ret ? this.#bson.length : this.#_bson.length
    return _ret ? this.data() : this
  }
  limit(start = 0, length = this.#length, ret = this.#return) {
    let _start, _length, _ret;
    if (arguments.length == 1) {
      _start = 0
      _length = typeof start === 'number' ? parseInt(start) : this.#length
      _ret = typeof start === 'boolean' ? start : this.#return
    } else if (arguments.length == 2) {
      _start = typeof length === 'number' ? (parseInt(start) || 0) : 0
      _length = typeof length === 'number' ? parseInt(length) : (parseInt(start) || this.#length)
      _ret = typeof length === 'boolean' ? length : this.#return
    } else {
      _start = start
      _length = length
      _ret = ret
    }
    let _bson = this.#currentBson()
    let res = []
    _bson.forEach((item, index) => {
      if (index >= _start && index < _start + _length) {
        res.push(item)
      }
    })
    this.#_bson = res.concat()
    return _ret ? this.data() : this
  }
  data() {
    let _bson = this.#currentBson()
    this.#_bson = undefined
    this.#length = this.#bson.length
    return _bson
  };
  // private method
  #generateKey() {
    let _rnd,
      str = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      _arr = [];
    for (let i = 0; i < 32; i++) {
      _rnd = i === 0 ? Math.floor(Math.random() * 52) : Math.floor(Math.random() * str.length)
      _arr.push(str[_rnd])
    }
    return _arr.join('')
  };
  #where(data, where) {
    // console.log(data, where)
    // 判断data数据是否符合where语句条件，然后返回boolean
    let condition = [];
    const reg = /([a-zA-Z0-9_]+)\s*(\=|\<\=|\>\=|\!\=|\<\>|\>|\<|\slike\s)\s*[\"\']?([a-zA-Z0-9_]+)[\"\']?/i
    const reg1 = /\s+(and|or|\&\&|\|\|){1}\s+/i
    let getWhere = (_where) => {
      try {
        let _whereMatch = _where.match(reg)
        if (_whereMatch && _whereMatch.length > 3) {
          let item = _whereMatch[1]
          let operate = _whereMatch[2]
          let val = _whereMatch[3]
          // console.log(item, operate, val)
          condition.push(
            Boolean((operate == '=' && data[item] == val) ||
              (operate == '>=' && data[item] >= val) ||
              (operate == '>' && data[item] > val) ||
              ((operate == '!=' || operate == '<>') && data[item] != val) ||
              (operate == '<=' && data[item] <= val) ||
              (operate == '<' && data[item] < val) ||
              (operate == ' like ' && (data[item]).toString().indexOf(val) > -1))
          )
          if (reg1.test(_where.replace(_whereMatch[0], ''))) {
            let _whereMatch1 = _where.replace(_whereMatch[0], '').match(reg1)
            condition.push((_whereMatch1[1]).toString().toLowerCase() === 'and' || _whereMatch1[1] === '&&' ? 'and' : 'or')
            return getWhere(_where.replace(_whereMatch[0], '').replace(_whereMatch1[0], ''))
          } else {
            // 计算condition最终值，并return返回
            let result = condition[0] || false
            if (condition.length > 1) {
              let i = 1;
              let res = () => {
                result = condition[i] === 'and' ? !!(condition[i - 1] && condition[i + 1]) : !!(condition[i - 1] || condition[i + 1])
                // console.log(result, i, 'aaa', condition)
                if (condition.length > i + 1) {
                  i = i + 2;
                  return res()
                }
              }
              res()
            }
            return result
          }
        }
      } catch (err) {
        throw new Error(err)
      }
    }
    return getWhere(where)
  };
  #sort(sort) {
    let _bson = this.#currentBson()
    let _arr = sort.replace(/\, /g, ',').split(',')
    // console.log(_arr, 'sort')
    let compare = () =>{
      return (a, b) => {
        return (() => {
          try {
            let l = _arr.length
            for (let i = 0; i < l; i++) {
              let item = _arr[i]
              let _item = item.trim().replace(/( desc)/i, '').replace(/( asc)/i, '')
              if (a[_item] != b[_item]) {
                return /( desc)$/i.test(item) ? (a[_item] < b[_item] ? 1 : -1) : (a[_item] > b[_item] ? 1 : -1)
              }
            }
          } catch (err) {
            throw new Error(err)
          }
        })();
      }
    }
    return _bson.sort(compare())
  };
  #currentBson() {
    return this.#_bson ? this.#_bson.concat() : this.#bson.concat()
  }
}
