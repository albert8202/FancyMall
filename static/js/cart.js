
checkLogin();

function displayCarts() {
    var cart_data;
    myAJAX({
        type: 'get',
        url: 'getCart',
        data: {},
        success: function (d) {
            data = JSON.parse(d);
            if (data.code == 200) {
                console.log("获取商品成功！");
                cart_data = data.data;

                var table_container = document.querySelector('.table-wrapper');
                if (cart_data.length==0){
                    table_container.innerHTML=`<div class="goOn" id="blank-show">空空如也~<a href="./index.html">去逛逛叭！</a></div>`;
                }
                else{
                var insert = document.createElement("div");
                table_container.setAttribute("id","cart-table");
                for (let i = 0; i < cart_data.length; i++) {

                    var tr_container = document.createElement("tr");
                    var pic_url = "../img/" + cart_data[i].pic_url;
                    var total = cart_data[i].amount * cart_data[i].price;
                    var num = i + 1;


                    tr_container.innerHTML =

                        `<td >${num}</td>` +
                        `<td>${cart_data[i].name}</td>` +
                        `<td><img class="product-pic-small" src="${pic_url}"></td>` +
                        `<td>${cart_data[i].desc}</td>` +
                        `<td class="price" id="price-${cart_data[i].id}">${cart_data[i].price}元</td>` +
                        `<td class="number">` +
                        `<img class="sub" src="./img/sub-icon.jpg" id="sub-${cart_data[i].id}" href="#">` +
                        `<span class="quantity" id="amount-${cart_data[i].id}">${cart_data[i].amount}</span>` +
                        `<img class="add" src="./img/add-icon.jpg"id="add-${cart_data[i].id}"href="#">` +
                        `</td>` +
                        `<td class="totalPrice" id="total-${cart_data[i].id}">${total}元</td>` +
                        `<td ><a class="del" id="del-${cart_data[i].id}" href="#">删除</a></td>`;

                    tr_container.setAttribute("class", "tr-content-container");
                    tr_container.setAttribute("id", "tr-content-container" + `${cart_data[i].id}`);

                    insert.appendChild(tr_container);
                    table_container.innerHTML = insert.innerHTML;
                }

                // 设置表格头
                table_container.innerHTML =
                    `<tr class="tr-title-container">` +
                    `<th>#</th>` +
                    `<th>商品名称</th>` +
                    `<th>商品图片</th>` +
                    `<th>商品详情</th>` +
                    `<th>单价</th>` +
                    `<th>购买数量</th>` +
                    `<th>小计</th>` +
                    `<th>操作</th>` +
                    `</tr>`+
                    table_container.innerHTML;


            }     inert_clear = `<img src="../img/cart-icon.svg">` +
                 `清空购物车`;
            if (cart_data.length!=0) {           table_container.parentElement.children[3].innerHTML = `<img src="../img/cart-icon.svg">` +
                `<a href="#">清空购物车</>`;}



             // let total_small = document.querySelectorAll(".totalPrice");
             // total_small.onchange=function () {
             //     var ALL=0;
             //     for(let i = 0;i<total_small.length;i++){
             //         tt = total_small[i].innerHTML;
             //         tt=tt.substr(0,tt.length-1);
             //         console.log("tt"+typeof tt);
             //         var tt_num = Number(tt);
             //         console.log("tt_num"+tt_num);
             //         ALL = ALL + tt_num;
             //         console.log("sfdsafas"+typeof ALL);
             //        console.log("ALL"+ALL);
             //         let kk = document.getElementById('TOTAL');
             //         kk.innerHTML=`总价：`+`${ALL.toString()}`;
             //    }
             // }

            //移除一件
            let sub_btns = document.querySelectorAll(".sub");
            console.log(sub_btns);
            for (let i = 0; i < sub_btns.length; i++) {
                // console.log(i);
                // console.log(sub_btns[i]);
                sub_btns[i].onclick = function () {
                    let msg = confirm("您要从购物车中移除一件吗？");
                    if (msg==true){
                        let product_id = sub_btns[i].id.split('-')[1];
                        sub_btns[i].parentNode.childNodes[1].innerHTML;//数量
                        if (sub_btns[i].parentNode.childNodes[1].innerHTML > 0) {
                            sub_btns[i].parentNode.childNodes[1].innerHTML -= 1;
                            let price = document.getElementById('price-' + product_id).innerHTML;
                            let amount = document.getElementById('amount-' + product_id).innerHTML;
                            price = price.substr(0, price.length - 1);
                            var price_num = Number(price);
                            var amount_num = Number(amount);
                            var total_num = price_num * amount_num;
                            console.log(total_num);
                            document.getElementById('total-' + product_id).innerHTML = total_num.toString() + "元";

                        }
                        alert('修改购物车成功！');
                    }

                }
            }


            //加一件
            let add_btns = document.querySelectorAll(".add");

            for (let i = 0; i < add_btns.length; i++) {
                // console.log(i);
                // console.log(sub_btns[i]);
                add_btns[i].onclick = function () {
                    let msg=confirm("您要添加一件到购物车中吗？");
                    if (msg==true){
                        let product_id = add_btns[i].id.split('-')[1];
                        add_btns[i].parentNode.childNodes[1].innerHTML;
                        if (add_btns[i].parentNode.childNodes[1].innerHTML > 0) {
                            add_btns[i].parentNode.childNodes[1].innerHTML -= -1;
                            let price_html = document.getElementById('price-' + `${product_id}`).innerHTML;
                            let amount_html = document.getElementById('amount-' + `${product_id}`).innerHTML;
                            price_str = price_html.substr(0, price_html.length - 1);
                            var price_num = Number(price_str);
                            var amount_num = Number(amount_html);
                            console.log("price22");
                            console.log("price");
                            // console.log(price_num);
                            // console.log(typeof amount_num*price_num);
                            var total_num = price_num * amount_num;
                            // console.log(total_num);
                            document.getElementById('total-' + product_id).innerHTML = total_num.toString() + "元";

                        }
                        alert('修改购物车成功！');
                    }
                }
            }

            //删除一项
            let del_btns = document.querySelectorAll(".del");
            for(let i=0;i<del_btns.length;i++){
                del_btns[i].onclick=function () {
                    let msg=confirm("您要从购物车中完全移除这件商品吗？");
                    if(msg){
                        var product_id1 = del_btns[i].id.split('-')[1];
                        console.log(product_id1);
                        const AMOUNT = 0;
                        let small_totals = document.querySelectorAll('.totalPrice');
                        let sum=0;
                        for (let x =0;x<small_totals.length;x++){
                            if (small_totals[x].id.split('-')[1]!=product_id1){
                                gg =small_totals[x].innerHTML;
                                var hh = gg.substr(0,gg.length-1);
                                ff = Number(hh);
                                sum +=ff;
                            }

                        }
                        console.log(sum);

                        myAJAX({
                            type: 'get',
                            url: 'updateCart',
                            data: {
                                'product_id':product_id1,
                                'amount':AMOUNT,
                                'total':sum
                            },
                            success:function (dd) {
                                let DD = JSON.parse(dd);
                                if (DD.code==200){
                                    let tr = document.getElementById("tr-content-container"+product_id1);
                                    console.log(tr);
                                    tr.setAttribute("style","display:none");
                                    alert(DD.msg);
                                }
                            }
                        });
                    }
                }
            }

            //清空购物车
            let clear =document.getElementById('clear-all');
            clear.onclick=function () {
                var ALL=0;
                var small_total = document.querySelectorAll(".totalPrice");
                    for(let i = 0;i<small_total.length;i++){
                        tt = small_total[i].innerHTML;
                        tt=tt.substr(0,tt.length-1);
                        console.log("tt"+typeof tt);
                        var tt_num = Number(tt);
                        console.log("tt_num"+tt_num);
                        ALL = ALL + tt_num;}
                        console.log("sfdsafas"+typeof ALL);
                       console.log("ALL"+ALL);


                let msg = confirm("您确定要清空购物车吗？您的订单金额共"+`${ALL}`+"元");
                if (msg){
                    let cartt = document.getElementById("cart-table");
                                 let clearr = document.getElementById("clear-all");
                                 document.getElementById("blank-show").style.display="show";
                                cartt.setAttribute("style","display:none");
                                clearr.setAttribute("style","display:none");
                                 alert("交易成功！");


                    myAJAX({
                        type: 'get',
                        url: 'clearCart',
                        data: {},
                        success:function (ddd) {
                            data = JSON.parse(ddd);
                            if(data.code==200){
                                alert(data.msg);

                            }
                        }
                    });
                }
            }


        }}
    });
}

displayCarts();

//
// let small = document.querySelectorAll(".totalPrice");
// let ALL = 0;
// for (let i = 0; i < small.length; i++) {
//     tt = small[i].innerHTML;
//     tt = tt.substr(0, tt.length - 1);
//     let tt_num = Number(tt);
//     ALL = ALL + tt_num;
//     let kk = document.getElementById('TOTAL');
//     kk.innerHTML = `总价：` + `${ALL.toString()}`;
// }

