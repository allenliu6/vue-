let app1 = new Observer({
  name: 'youngwind',
  age: 25
});

let app2 = new Observer({
  university: 'bupt',
  major: 'computer'
});

// 要实现的结果如下：s
app1.data.name // 你访问了 name
app1.data.age = 100;  // 你设置了 age，新的值为100
app2.data.university // 你访问了 university
app2.data.major = 'science'  // 你设置了 major，新的值为 science


function Observer(obj){
	this.data = {}
	for(let key of Object.keys(obj)){
		Object.defineProperty(this.data, key, {
			enumerable: true,
      configurable: true,
			get: function(){
				console.log(`你访问了 ${key}`)
				return obj[key]
			},
			set: function(val){
				console.log(`你设置了 ${key}，新的值为${val}`)
			}
		})
	}
	return this
}

var str = readline(),
	arr = str.split(""),
	result = [],
	flag = true,
	max = 0

arr.forEach(function(item, index, array){
	for(var i = index + 1; i <= array.length; i++){
		var item = array.slice(index, i),
			length = item.length;

		if(length === 1) continue
		for (var j = 0; j < length/2; j++) {
			if(item[j] !== item[length	- j - 1]){
				flag = false
			}
		}
		if(flag && length > max){
			max = length
		}
		flag = true
	}
})

print(arr.length - max ? max : 1);
