{
    var interFace = function (){
        var event = {}
        return {
            dispatch(type){
                if(event[type]){
                    event[type].forEach(function(element) {
                        element()
                    })
                }
            },
            addEvent(type, callback){
                if(event[type]){
                    event[type].push(callback)
                } else {
                    event[type] = [callback]
                }
            }
        }
    }
    var {dispatch, addEvent} = interFace()
    addEvent("如果有新楼盘请通知我", function(){
        console.log("我要去抢房子")
    })                              // 订阅消息
    dispatch("如果有新楼盘请通知我")   // 发布消息   有房源了！！
}
