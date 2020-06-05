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

function checkLogin(){
    myAJAX({
        type: 'get',
        url: 'checkLogin',
        data: {},
        success:function (d) {
            console.log(d);
            data = JSON.parse(d);
            var btn2s = document.getElementsByClassName("log-btn2");
            if (data.code==200){

                var btns = document.getElementsByClassName("log-btn");
                for(i=0;i<btns.length;i++){
                    btns[i].setAttribute("style","display:none");
                }
                for (let i=0;i<btn2s.length;i++) {
                    btn2s[i].setAttribute("style","display:show");
                }

            }
            else {
                btn2s[i].setAttribute("style","display:none");
            }
        }

    });
}

function logout(){
    myAJAX({
        type: 'get',
        url: 'logOut',
        data: {},
        success:function (d) {
            console.log(d);
            data = JSON.parse(d);
            console.log(data);
            console.log("aaaaaaa");

            alert(data.msg);
            window.location.href="/login.html";
                // var btn2s = document.getElementsByClassName("log-btn2");
                // for (let i=0;i<btn2s.length;i++) {
                //     btn2s[i].setAttribute("style","display:show");
                // }
                //
        }

    });
}

function checkLogout(){
    var out =document.getElementsByClassName('log-btn2');
    for (let i =0;i<out.length;i++){
        out[i].onclick=function () {
            let msg=confirm("您要退出LeeMall吗？");
            if (msg){
                logout();
            }
            console.log("退出");
        }
    }
}


window.addEventListener("scroll", function () {
    let header = document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 0);
})






