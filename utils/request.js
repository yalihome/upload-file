//定义发送请求的全局对象
(function (win) {
    win.request = {
        get: get,
        post: post
    };

    //处理请求
    function requestHandler(obj) {
        return new Promise(function (resolve, reject) {
            let xhr = getXhr();
            if (xhr) {
                //监听xhr对象变化
                xhr.onreadystatechange = function () {
                    console.log("readyState:"+xhr.readyState);
                    console.log("responseHeaders:"+xhr.getAllResponseHeaders())
                    if (xhr.readyState === 4) {
                        //请求结束后关闭 laoding
                        if (xhr.status == 200) {
                            resolve(value)
                        } else {
                            //特殊状态特殊处理
                            //配置过的错误状态提示码，提示对应信息，401/400/403 打回首页，未登录的打回去登录
                            reject(err);
                        }
                    }
                }
                obj.method = (obj.method || "get").toUpperCase();
                obj.params = obj.params || null;
                //发送请求之前需要序列化参数，无论post请求还是get请求都会有 query(query) 或 body(params) 传参，这时就需要我们处理了
                if (obj.query) {
                    let arr = [];
                    let url;
                    for (var pro in obj.query) {
                        if (obj.query.hasOwnProperty(pro)) {
                            arr.push(pro + "=" + obj.query[pro]);
                        }
                    }
                    var idx = obj.url.findIndex("?");
                    if (idx > -1) {
                        url = obj.url.subString(0, idx + 1) + arr.join("&") + obj.url.subString(idx + 1);
                    } else {
                        url = obj.url + "?" + arr.join("&");
                    }
                }
                xhr.open(obj.method, url, true);
                xhr.send(obj.params);
                //发送请求后页面需要调起 loading
            } else {
                alert("您的浏览器不支持XMLHTTP")
            }
        });
    }

    //发送 get 请求
    function get(obj) {

    }
    //发送 post 请求
    function post(obj) {

    }

    function getXhr() {
        if (win.XMLHttpRequest) {
            return new XMLHttpRequest();
        } else if (win.ActiveXObject) {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
})(window || {});

