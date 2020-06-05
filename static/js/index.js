
function displayProducts(){
    var product_data;
    myAJAX({
        type:'get',
        url: 'getProduct',
        data:{},
        success:function (d) {
            data =JSON.parse(d);
            if(data.code==200){
                console.log("获取商品成功！");
                product_data = data.data;
                console.log(product_data);

                var product_container = document.querySelector('.product-container');

                for(let i=0;i<product_data.length;i++){
                    picURL="../img/"+product_data[i].pic_url;
                    console.log(picURL);
                    let product_node =  document.createElement("div");
                    let name_node = document.createElement("h1");
                    let desc_node = document.createElement("p");
                    let pic_node = document.createElement("img");
                    let info_node = document.createElement("div");
                    let price_node = document.createElement("div");
                    let button_node = document.createElement("a");

                    product_node.setAttribute("class","product-card");
                    pic_node.setAttribute("class","product-pic");
                    pic_node.setAttribute("src",picURL);
                    console.log(pic_node.attribute);
                    info_node.setAttribute("class","product-info");
                    price_node.setAttribute("class","product-price");
                    button_node.setAttribute("class","product-button");
                    button_node.setAttribute("href","#")
                    button_node.setAttribute("id","add-btn-"+product_data[i].id);
                    name_node.innerHTML=product_data[i].name;
                    desc_node.innerHTML=product_data[i].desc.toString();
                    price_node.innerHTML = "$"+product_data[i].price;
                    button_node.innerHTML = "加入购物车";
                    info_node.appendChild(price_node);
                    info_node.appendChild(button_node);
                    product_node.appendChild(name_node,);
                    product_node.appendChild(desc_node);
                    product_node.appendChild(pic_node);
                    product_node.appendChild(info_node);
                    product_container.appendChild(product_node);


                }

                let add_btns = document.querySelectorAll(".product-button");
                for(let j=0;j<add_btns.length;j++){
                    add_btns[j].onclick=function () {
                        var pro_id = add_btns[j].id.split('-')[2];
                        var msg = confirm("您要添加到购物车吗？");
                        if(msg==true){
                            myAJAX({
                                type:'get',
                                url: 'addCart',
                                data:{'product_id':pro_id},
                                success:function (da) {
                                    Data =JSON.parse(da);
                                    if (Data.code==200){
                                        console.log("添加商品成功！");
                                        alert(Data.msg);
                                    }
                                    else alert(Data.msg);
                                }
                            });
                        }
                    }
                }
            }

        }
    });
}

checkLogin();

displayProducts();

//广告栏

var index=0

let spanEl = document.querySelectorAll(".line-btn span");
var listName=["list1","list2","list3","list4","list5","list6"];


function setLineBtnColor() {
    for (let i=0;i<spanEl.length;i++)
    {
        spanEl[i].style.background="#ccc";
    }
    spanEl[index].style.background="#45c17c";

}


setLineBtnColor();

let liEl = document.querySelectorAll(".img-list ul li")
console.log(liEl)

setInterval(function nextPic() {
    listName.unshift(listName[5]);//复制最后一个并插到第一个位置
    listName.pop();//删除最后一个
    for (let i = 0; i < liEl.length; i++)
    {
        liEl[i].setAttribute("class",listName[i]);
    }
    index++;
    if(index>5){
        index=0;
    }
    setLineBtnColor();
    console.log("next")
},3000);



function prePic() {
    listName.push(listName[0]);//第一个值插到最后
    listName.shift();//删掉第一个
    for (let i = 0; i < liEl.length; i++)
    {
        liEl[i].setAttribute("class",listName[i]);
    }
    index--;
    if(index<0){
        index=5;
    }
    setLineBtnColor();
    console.log("pre")
}

let imgList = document.querySelector(".img-list")
imgList.addEventListener("click",function (e) {
    if (e.target.parentNode.getAttribute("class")==="list3"){
        nextPic()
    }
    else
    if (e.target.parentNode.getAttribute("class")==="list1"){
        prePic()
    }
})
