var Observer = function (options, parent = null) {
	this.data = options
	this.parent = parent
	this.event = {}
	for (let key of Object.keys(options)) {
		if (typeof options[key] === 'object' && options[key] instanceof Object) {
			new Observer(options[key], this)
		}
		this.defineSetget(key, options[key])
	}
}

Observer.prototype.defineSetget = function (key, val) { // callback不好
	let self = this
	Object.defineProperty(this.data, key, {
		get: function () {
			console.log(`你访问了${key}`)
			return val
		},
		set: function (newVal) {
			val = newVal
			if (typeof val === 'object' && val instanceof Object) {
				new Observer(val)
			}
			self.emit()
		}
	})
}

Observer.prototype.$watch = function (key, fn) {
	this.event['set'] = this.event['set'] || []
	this.event['set'].push(fn)
}

Observer.prototype.emit = function () {
	if (this.event['set'] && this.event['set'].length) {
		for (let fn of this.event['set']) {
			fn()
		}
	}
	if (this.parent) {
		this.parent.emit()
	}
}



/*var Observer = function(obj){
	this.data = obj //画龙点睛之笔   联通obj和data   使得若无返回值则只将传入对象设为observe，若存在返回值则获得有data属性的一个observe实例  同时定义属性也相当于只在obj上定义，不用担心环环嵌套中出现data  
	//vue.data
	obj.$event = [];

	for(let key of Object.keys(obj)){
		if (typeof obj[key] === 'object' && obj[key] instanceof Object) {
			new Observer(obj[key])
		}
		this.defineSetget(obj[key], key)
	}
}

Observer.prototype.defineSetget = function(val, key){//callback不好
	Object.defineProperty(this.data, key, {
		get: function(){
			console.log(`你访问了 ${key}`)
			return val
		},
		set: function(newVal){
			val = newVal
			if (typeof val === 'object' && val instanceof Object) {
				new Observer(val)
			}
			console.log(`你设置了 ${key}，新的值为${val}`)
		}
	})
}

Observer.prototype.$watch = function(key, callback){
	let keys = key.split('.'),
		val = this.data[keys.shift()]

	for(let index of keys){
		//订阅下一级
		this.$listen(val, key, callback)
		val = val[index]
	}
	//this.defineSetget(this.data[key], key, callback)
}

Observer.prototype.$listen = function(obj, key, callback){
	obj.$event.push({key: callback})
}

Observer.prototype.$emit = function(){
	
}
*/