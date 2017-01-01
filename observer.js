function Observer(options, keyword) {
    this.data = options

    Object.keys(options).forEach((key) => {
        if (typeof options[key] === 'object' && options[key] instanceof Object) {
            new Observer(options[key], key)
        } else {
            this.defineSetget(key, options[key])
        }
    })
}

Observer.prototype.defineSetget = function (key, val) {
    const dep = new Dependence(key, val)    // 闭包一个dep实例

    Object.defineProperty(this.data, key, {
        enumerable: true,
        configurable: true,
        get() {
            if (Dependence.target) { // 添加唯一ID 辨识
                dep.addDep()         // 添加watcher进 dep实例
            }
            return val              // 返回闭包数据
        },
        set(newVal) {
            if (val === newVal) return
            val = newVal            // 修改闭包数据
            console.log(`你改变了${key}`)
            if (typeof val === 'object' && val instanceof Object) {
                new Observer(val)
            }
            dep.notify(newVal)      // 通知，即发布数据变动
        }
    })
}

function Dependence(key, val) {
    this.value = val
    this.key = key
    this.subs = []

    return this
}

Dependence.target = null

Dependence.prototype.update = function (value) {
    this.value = value
    this.subs.forEach(function (elem, index) {
        elem.update(value)
    })
}

Dependence.prototype.notify = function (value) {
    this.update(value)
}

Dependence.prototype.addDep = function () {
    var target = Dependence.target
    this.subs.every(function (elem, index) {
        elem.id === target.id
    })

    this.subs.push(Dependence.target)
    Dependence.target = null
}