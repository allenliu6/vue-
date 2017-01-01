function nodeTofragment(node) {
    let flag = document.createDocumentFragment(),
        child

    while (child = node.firstChild) {
        flag.appendChild(child)
    }

    return flag
}

function compile(node, data) {
    // 全局置换  一元素多个模板的情况
    const reg = /\{\{(.*)\}\}/
    if (node.nodeType === 1) {
        // 暂不处理addribute情况

        if (node.getAttribute("v-model")) {
            let model = node.getAttribute("v-model"),
                tokens = []

            tokens.push({
                type: "model",
                value: model,
                html: false,
                oneTime: false
            })
            new Watcher("model", model, node, tokens, data)
        }
        node.childNodes.forEach(function (item, index) {
            compile(item, data)
        })
    }

    if (node.nodeType === 3) {
        if (reg.test(node.nodeValue)) {
            let name = RegExp.$1,
                optionalValue = data,
                nodeValue = node.nodeValue,
                arr = [],
                tokens = [];

            name = name.trim()

            arr = nodeValue.split("{{" + name + "}}")
            for (let i = 0, length = arr.length * 2 - 1; i < length; i++) {
                if (i % 2 === 1) {
                    tokens.push({
                        value: name,
                        html: false
                    })
                } else {
                    if (!arr[i / 2]) {
                        continue;
                    }
                    tokens.push({
                        value: arr[i / 2],
                        html: true,
                        type: "text",
                        oneTime: false
                    })
                }
            }
            new Watcher("text", name, node, tokens, data)
        }
    }
}

function Watcher(type, path, DOM, tokens, vm) {
    this.type = type
    this.keyPath = path
    this.node = DOM
    this.tokens = tokens

    // Directive的功能
    if (type === "model") {
        DOM.addEventListener("input", e => this.set(vm, path, e.target.value))
    }

    Dependence.target = this
    this.tokens.forEach((elem) => {
        if (!elem.html) {
            this.update(this.get(vm, path)) // get到值 完成依赖收集 然后进行node初始化赋值
        }
    })
}

// 触发相应发布者的getter
Watcher.prototype.get = function (vm, path) {
    let arr = path.split(".")

    if (arr.length === 1) {
        return vm[arr[0]]
    }
    return path.split(".").reduce(function (pre, item) {
        if (typeof pre === "object") {
            return pre[item]
        } else {
            return vm[pre][item]
        }
    })
}

// 触发相应发布者的getter
Watcher.prototype.set = function (vm, path, value) {
    let arr = path.split(".")

    switch (arr.length) {
        case 1:
            vm[arr[0]] = value
            break;
        case 2:
            vm[arr[0]][arr[1]] = value
            break;
        default:
            let twoElem = arr.splice(arr.length - 2, 2),
                middleValue = arr.reduce(function (pre, item) {
                    if (typeof pre === "object") {
                        return pre[item]
                    } else {
                        return vm[pre][item]
                    }
                })

            middleValue[twoElem[0]][twoElem[1]] = value
    }
}

// 通知Directive更新DOM
Watcher.prototype.update = function (value) { // DOM变动
    // 如果有不同父对象 但键值相同的情况 如何处理 ？？
    this.tokens.forEach(function (elem) {
        if (!elem.html) {
            elem.value = value
        }
    })

    if (this.tokens.length === 1) {
        if (this.type === "model") {
            this.node.value = this.tokens[0].value
        }
        this.node.nodeValue = this.tokens[0].value
    } else {
        this.node.nodeValue = this.tokens.reduce(function (pre, cur) {
            return (pre.value ? pre.value : pre) + cur.value
        })
    }
}
