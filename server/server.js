
const http = require('http')
const fs = require('fs')
// const common = require('./libs/common')
const uuid = require('uuid/v1')
const zlib = require('zlib')

let server = http.createServer((req, res) => {
    console.log(req.method);
    console.log(req.query);
    console.log(req.params);
    // console.log(res);
    if(req.method=="POST"){
        if(req.url=="/sys/upload"){

        }
    }else if(req.method=="GET"){

    }
    
    let arr = [];
    req.on('data', data => {
        arr.push(data)
    })
    req.on('end', () => {
        let data = Buffer.concat(arr);
        let post = {};
        let files = {}
        console.log(bound)
        // data
        // 解析二进制文件上传数据
        // 获取分隔符 
        //content-type:multipart/form-data; boundary=----WebKitFormBoundaryPrAAAnu8AfAbfCwj
        if (req.headers['content-type']) {
            let str = req.headers['content-type'].split('; ')[1]
            if (str) {
                //获取boundary
                let boundary = '--' + str.split('=')[1]
                //1. 用分隔符切分整个数据
                let arr = data.split(boundary)
                //2. 丢弃头尾两个数据
                arr.shift()
                arr.pop()
                //3. 丢弃每个数据头尾的\r\n
                arr = arr.map(buffer => buffer.slice(2, buffer.length - 2))
                //4. 每个数据的第一个‘\r\n\r\n’处切开
                arr.forEach(buffer => {
                    let n = buffer.indexOf('\r\n\r\n');
                    let disposition = buffer.slice(0, n);
                    let content = buffer.slice(n + 4)
                    disposition = disposition.toString()
                    if (disposition.indexOf('\r\n') == -1) {
                        // 普通数据;
                        content = content.toString();
                        let name = disposition.split('; ')[1].split('=')[1];
                        name = name.slice(1, name.length - 1)

                        post[name] = content;
                    } else {
                        // 文件数据
                        let [line1, line2] = disposition.split('\r\n');
                        //line1:Content-Disposition: form-data; name="f1"; filename="1.txt"
                        //line2:Content-Type: text/plain
                        let [, name, filename] = line1.split('; ');
                        name = name.split('=')[1]
                        name = name.slice(1, name.length - 1);

                        filename = filename.split('=')[1]
                        filename = filename.slice(1, filename.length - 1);
                        let type = line2.split(': ')[1]

                        let path = `upload/${uuid().replace(/\-/g, '')}`;
                        let rs = fs.createReadStream(filename);
                        let ws = fs.createWriteStream(path);
                        let gzip = zlib.createGzip();
                        rs.pipe(gzip).pipe(ws);

                        rs.on('error', err => {
                            res.write('写入失败');
                            console.log(err);
                            res.end();
                        });

                        ws.on('finish', () => {
                            console.log('写入成功')
                        })
                    }
                })
                console.log(post)
            }
        }
        res.end()
    });
});

server.listen(8080);
console.log("----------Listening to port 8080----------")