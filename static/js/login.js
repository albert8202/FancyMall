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


let inputElement = document.querySelectorAll('.txtb input')
console.log(inputElement)
for(i=0;i<inputElement.length;i++)
{
    console.log(inputElement[i])
    let el = inputElement[i]
        el.addEventListener('focus',function () {
            el.classList.add('focus')

        })
        el.addEventListener('blur',function () {
            if (el.value=='')
                el.classList.remove('focus');
        })

}

function login() {
    let username = document.getElementById('username');
    let password = document.getElementById('password');
    let logbtn = document.getElementById('log-btn');

    logbtn.onclick=function () {

        if(username.value==''){
            alert("请输入用户名！");
        }
        else if(password.value==''){
            alert("请输入密码！");
        }
        else {
            myAJAX({
                type:'get',
                url: 'login',
                data:{
                    name:username.value,
                    psw:password.value
                },
                success:function (res) {
                    console.log(res);
                    res =strToJson(res);
                    if(res.code==200){
                        console.log("登录成功");
                        window.location.href='/index.html';
                        alert(res.msg);
                    }
                    else{
                        warn = res.msg;
                        alert(warn);
                    }

                }
            });
        }


    }
}

login();