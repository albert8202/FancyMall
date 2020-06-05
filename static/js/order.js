checkLogin();

function displayOrders(){
    var order_data;
    myAJAX({
        type:'get',
        url: 'getOrders',
        data:{},
        success:function (d) {
            data =JSON.parse(d);
            if(data.code==200){
                console.log("获取商品成功！");
                order_data = data.data;
                console.log(order_data);
                var table_container = document.querySelector('.table-wrapper');
                if (order_data.length==0){
                    table_container.innerHTML=`<div class="goOn" id="blank-show">空空如也~<a href="./index.html">去逛逛叭！</a></div>`;
                }else{


                console.log(table_container);

                var pre_time = '';//与前一个比较
                var order_num = 0; //订单序号
                var rowspan_num = 0;
                var insert = document.createElement("div");

                for (let i=0;i<order_data.length;i++){
                    var tr_container = document.createElement("tr");
                    var pic_url = "../img/"+order_data[i].pic_url;
                    var total = order_data[i].amount*order_data[i].price;
                    var pur_time = order_data[i].create_time.substr(0,10);

                    // +" "+order_data[i].create_time.substr(14,16).split('.')[0]
                    if (pre_time!=order_data[i].create_time){
                        rowspan_num=0;
                        order_num++;
                        for (let j=i;j<order_data.length;j++){
                            if(order_data[j].create_time===order_data[i].create_time){
                                rowspan_num++;
                            }
                        }
                        console.log(rowspan_num);

                        tr_container.innerHTML=

                            `<td rowspan="${rowspan_num}">${order_num}</td>`+
                            `<td>${order_data[i].name}</td>`+
                            `<td><img class="product-pic-small" src="${pic_url}"></td>`+
                            `<td>${order_data[i].desc}</td>`+
                            `<td class="price">${order_data[i].price}元</td>`+
                            `<td class="number">${order_data[i].amount}</td>`+
                            `<td class="price totalPrice">${total}元</td>`+
                            `<td rowspan="${rowspan_num}">${pur_time}</td>`;



                    }
                    else{

                        tr_container.innerHTML=
                            `<td>${order_data[i].name}</td>`+
                            `<td><img class="product-pic-small" src="${pic_url}"></td>`+
                            `<td>${order_data[i].desc}</td>`+
                            `<td class="price">${order_data[i].price}元</td>`+
                            `<td class="number">${order_data[i].amount}</td>`+
                            `<td class="price totalPrice">${total}元</td>`;

                    }
                    pre_time = order_data[i].create_time;
                    tr_container.setAttribute("class","tr-content-container");

                    insert.appendChild(tr_container);
                    table_container.innerHTML=insert.innerHTML;

                }

                // 设置表格头
                table_container.innerHTML=
                    `<tr class="tr-title-container">`+
                    `<th>#</th>`+
                    `<th>商品名称</th>`+
                    `<th>商品图片</th>`+
                    `<th>商品详情</th>`+
                    `<th>单价</th>`+
                    `<th>购买数量</th>`+
                    `<th>小计</th>`+
                    `<th>购买时间</th>`+
                    `</tr>`+table_container.innerHTML;


            }

        }}
    });
}
displayOrders();