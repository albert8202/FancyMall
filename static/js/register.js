api_url = 'http://localhost:3000/api/';

function strToJson(str){
    var json = eval('(' + str + ')');
    return json;
}

//wrap the ajax function
function myAJAX(options){
    options.url = api_url + options.url;
    var xhr = new XMLHttpRequest();
    var params ='';
    for(let attr in options.data){
        params += attr +'='+options.data[attr]+'&';
    }
    params = params.substr(0,params.length - 1);
    if(options.type==='get'&&options.data.left!=0){
        options.url = options.url+'?'+params;
    }
    xhr.open(options.type,options.url);
    if(options.type==='post'){
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        xhr.send(params);
    }else {
        xhr.send();
    }

    xhr.onload = function () {
        options.success(xhr.responseText);
    }
}

function register() {
    let username = document.getElementById('name');
    let password = document.getElementById('psw');
    let regbtn = document.getElementById('reg-btn');

    regbtn.onclick=function () {
        console.log(username.value);
        console.log(password.value);
        if(username.value==''){
            alert("请输入用户名！");
        }
        else if(password.value==''){
            alert("请输入密码！");
        }
        else {
            myAJAX({
                type:'get',
                url: 'register',
                data:{
                    name:username.value,
                    psw:password.value
                },
                success:function (res) {
                    console.log(res);
                    res =strToJson(res);
                    if(res.code==200){
                        console.log(res);
                        window.location.href='/login.html';
                    }
                    else{
                        console.log(res);
                        warn = res.msg;
                        alert(warn);
                    }

                }
            });
        }


    }
}

window.onload=register();