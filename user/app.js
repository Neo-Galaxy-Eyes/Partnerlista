const http = require('http');

const url = require('url');
const querystring = require('querystring');

require('./model/index.js');
const User = require('./model/user.js');


//创建服务器
const app = http.createServer();

//为服务器对象添加请求事件
//之后会用到await关键字
app.on('request', async (req,res)=>{
    //获取请求方式
    //返回的字母为大写形式的
    const method = req.method;
    //得到请求地址
    //这里使用到解构赋值
    //query包含到了get的请求参数，默认情况下字符串类型
    //在parse添加true，query才会转为对象类型
    const {pathname,query} = url.parse(req.url,true);

    if(method == 'GET'){
        //呈现用户列表页面
        if(pathname == '/list'){
            //这里对应使用链式调用
            //查询用户信息
            let users = await User.find();
            //html字符串
            let list = 
            `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>用户列表</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css">
            </head>
            <body>
                <div class="container">
                    <h6>
                        <a href="/add" class="btn btn-primary">添加用户</a>
                    </h6>
                    <table class="table table-striped table-bordered">
                        <tr>
                            <td>用户名</td>
                            <td>年龄</td>
                            <td>爱好</td>
                            <td>邮箱</td>
                            <td>操作</td>
                        </tr>
            `;
            //对数据进行循环操作
            //动态数据拼接
            users.forEach(item=>{
                list += 
                `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.age}</td>
                    <td>                  
                `;

                item.hobbies.forEach(item=>{
                    list += `<span>${item}</span>`;
                });
                list += 
                `
                </td>
                    <td>${item.email}</td>
                    <td>
                        <a href="/remove?id=${item._id}" class="btn btn-danger btn-xs">删除</a>
                        <a href="/modify?id=${item._id}" class="btn btn-success btn-xs">修改</a>
                    </td>
                </tr>
                `;
            });
            list += 
            `
                    </table>
                    </div>
                </body>
                </html>
            `;
            res.end(list);
        }else if(pathname == '/add'){
            let add = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>用户列表</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css">
            </head>
            <body>
                <div class="container">
                    <h3>添加用户</h3>
                    <form method="post" action="/add">
                        <div class="form-group">
                            <label>用户名</label>
                            <input name="name" type="text" class="form-control" placeholder="请填写用户名">
                        </div>
                        <div class="form-group">
                            <label>密码</label>
                            <input name="password" type="password" class="form-control" placeholder="请输入密码">
                        </div>
                        <div class="form-group">
                            <label>年龄</label>
                            <input name="age" type="text" class="form-control" placeholder="请输入年龄">
                        </div>
                        <div class="form-group">
                            <label>邮箱</label>
                            <input name="email" type="email" class="form-control" placeholder="请填写邮箱">
                        </div>
                        <div class="form-group">
                            <label>请选择爱好</label>
                            <div>
                                <label class="checkbox-inline">
                                <input type="checkbox" value="足球" name="hobbies">足球
                                </label>
                                <label class="checkbox-inline">
                                <input type="checkbox" value="篮球" name="hobbies">篮球
                                </label>
                                <label class="checkbox-inline">
                                <input type="checkbox" value="橄榄球" name="hobbies">橄榄球
                                </label>
                                <label class="checkbox-inline">
                                <input type="checkbox" value="敲代码" name="hobbies">敲代码
                                </label>
                                <label class="checkbox-inline">
                                <input type="checkbox" value="唱歌" name="hobbies">唱歌
                                </label>
                                <label class="checkbox-inline">
                                <input type="checkbox" value="跳舞" name="hobbies">跳舞
                                </label>
                                <label class="checkbox-inline">
                                <input type="checkbox" value="freestyle" name="hobbies">freestyle
                                </label>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary">添加用户</button>
                    </form>
                </div>
            </body>
            </html>
            `;
            res.end(add);
        }else if(pathname == '/modify'){
            let user = await User.findOne({_id:query.id});
            let hobbies = ['足球','篮球','橄榄球','敲代码','唱歌','跳舞','freestyle'];
            console.log(user)
            //呈现修改用户表单页面
            let modify = 
            `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>用户列表</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css">
            </head>
            <body>
                <div class="container">
                    <h3>修改用户</h3>
                    <form method="post" action="/modify?id=${user._id}">
                        <div class="form-group">
                            <label>用户名</label>
                            <input value="${user.name}" name="name" type="text" class="form-control" placeholder="请填写用户名">
                        </div>
                        <div class="form-group">
                            <label>密码</label>
                            <input value="${user.password}" name="password" type="password" class="form-control" placeholder="请输入密码">
                        </div>
                        <div class="form-group">
                            <label>年龄</label>
                            <input value="${user.age}" name="age" type="text" class="form-control" placeholder="请输入年龄">
                        </div>
                        <div class="form-group">
                            <label>邮箱</label>
                            <input value="${user.email}" name="email" type="email" class="form-control" placeholder="请填写邮箱">
                        </div>
                        <div class="form-group">
                            <label>请选择爱好</label>
                            <div>
                           
            `;
            hobbies.forEach(item=>{
                //判断当前循环项在不在用户的爱好数组里
                let isHobby = user.hobbies.includes(item);
                if(isHobby){
                    modify +=  `
                    <label class="checkbox-inline">
                        <input type="checkbox" value="${item}" name="hobbies" checked>${item}
                    </label>                    
                    `
                }else{
                    modify +=  `
                    <label class="checkbox-inline">
                        <input type="checkbox" value="${item}" name="hobbies">${item}
                    </label>                    
                    `
                }
            })

            modify += `
                        </div>
                        </div>
                        <button type="submit" class="btn btn-primary">修改用户</button>
                    </form>
                </div>
            </body>
            </html>
            `;
            res.end(modify);
        }else if(pathname == '/remove'){
            await User.findOneAndDelete({_id:query.id});
            res.writeHead(301,{
                Location:'/list'
            });
            res.end();
        }

    }else if(method == 'POST'){
        //用户添加功能
        if(pathname == '/add'){
            //接收用户提交的信息
            //绑定传递事件
            let formData = '';
            //post参数是一步步传送的，所以会持续触发data事件
            req.on('data',(param)=>{
                formData += param;
            });
            //绑定传递结束事件
            //post参数接收完毕
            req.on('end', async ()=>{
                let user = querystring.parse(formData);
                //将用户提交的信息添加到数据库中
                await User.create(user);
                //重定向：相当于调用location.href进行页面跳转
                res.writeHead(301,{
                    Location:'/list'
                });
                //没写这个，就证明客户端的请求处理还没有结束，既然没有结束，上面的重定向也不会进行跳转
                res.end();
            })
            
        }else if(pathname == '/modify'){
            //绑定传递事件
            let formData = '';
            //post参数是一步步传送的，所以会持续触发data事件
            req.on('data',(param)=>{
                formData += param;
            });
            //绑定传递结束事件
            //post参数接收完毕
            req.on('end', async ()=>{
                let user = querystring.parse(formData);
                //将用户提交的信息添加到数据库中
                await User.updateOne({_id:query.id},user);
                //重定向：相当于调用location.href进行页面跳转
                res.writeHead(301,{
                    Location:'/list'
                });
                //没写这个，就证明客户端的请求处理还没有结束，既然没有结束，上面的重定向也不会进行跳转
                res.end();
            })
        }
    }
    url.parse(req.url);

})

//监听端口
app.listen(3000);