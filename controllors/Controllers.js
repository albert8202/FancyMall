var dbconfig = require('../config/dbconfig');

Date.prototype.Format=function(fmt){
  var o={
      "M+":this.getMonth()+1,//月份
      "d+":this.getDate(),//日
      "H+":this.getHours(),//小时
      "m+":this.getMinutes(),//分
      "s+":this.getSeconds(),//秒
      "q+":Math.floor((this.getMonth()+3)/3),//季度
      "S+":this.getMilliseconds()//毫毛
  };
  if(/(y+)/.test(fmt)) fmt=fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));
  for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};


//检查是否存在用户 TRUE:不存在，可以注册
let checkUser = async (name)=>{
  let sql='select `user`.user_name from `user` where `user`.user_name = ?' ;
  let sqlArr = [name];
  let result = await dbconfig.SySqlConnect(sql,sqlArr);
    if(result==''){
        console.log("don't have the same name");

        return true;
    }else{
        console.log("have the same name");

        return false;
    }
}

//APIs are as follow:


checkLogin=async (req,res)=>{
    console.log("验证登录");
  if (req.session.user_id==''){
    res.send({
        'code':400,
        'msg':"需要先登录哦！",
    });
  }
  else {
    let id = req.session.user_id;
    let sql= 'select user_name from `user` where `user`.id=?;';
    let sqlArr=[id];
    let result = await dbconfig.SySqlConnect(sql,sqlArr);
    if(result!=""){
      res.send({
          'code':200,
          'data':result[0].user_name,
          'msg':'已登录！'
      });
    }
  }
}

logOut=async(req,res)=>{
    console.log("准备退出");
    if(req.session.user_id==''){
        res.send({
            'code':400,
            'msg':'未登录！'
        });
    }else {
        req.session.user_id="";
        res.send({
            'code':200,
            'msg':'退出成功！'
        });
    }
}


//1. 注册 
register=async (req,res)=>{
  let emailReg =  /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
  let pswReg = /^[a-zA-Z0-9_#]{6,16}$/;
  var name =req.query.name;
  let psw =req.query.psw;
  console.log(name);
  console.log(psw);
  if(!await checkUser(name)){
    console.log("user exists");
    res.send({
      'code':400,
      'msg':'该邮箱已经被人注册过啦，换一个叭！'
    })

  }else if(!emailReg.test(name)){
    res.send({
        'code':400,
        'msg':'这似乎不是个邮箱呢，再试试叭！'
    })
  }
  else if(!pswReg.test(psw)){
    res.send({
        'code':400,
        'msg':'密码不合法哦，请您设置6~16位数不含特殊字符的密码哈！'
    })
  }
  else{
    let registerTime = new Date().Format("yyyy-MM-dd HH:mm:ss"); 
    let sql1 = "insert into `user` SET user_name=?,user_password=?,register_time=\'"+registerTime+"\';";
    let sql2 ="select * from `user` where `user`.user_name = ? and `user`.user_password=?;"
    let sqlArr = [name,psw];
    let result1 = await dbconfig.SySqlConnect(sql1,sqlArr);
    let result2 = await dbconfig.SySqlConnect(sql2,sqlArr);
    req.session.user_id=result2[0].id;
      console.log(req.session.user_id);
    res.send({
        'code':200,
        'msg':'注册成功！'
    })

  }

}

//2. 登录
login = async (req,res)=>{

  let name=req.query.name;
  let psw=req.query.psw
  if(await checkUser(name)){
    res.send({
      'code':400,
      'msg':'用户不存在！'
    })
  }else{
    let sql='select * from `user` where `user`.user_name = ? and `user`.user_password=? ' ;
    let sqlArr = [name,psw];
    let result = await dbconfig.SySqlConnect(sql,sqlArr);
      if(result==''){
          console.log("don't have the same name");
          console.log(result);
          res.send({
            'code':400,
            'msg':'密码不对哦，再试试呢！'
          })
      }else{
          console.log("have the same name");

          req.session.user_id=result[0].id;
          console.log(req.session.user_id);
          res.send({
            'code':200,
            'msg':'登录成功！开启您的奢华之旅~'
          })
      }
  }
}



//3. 获取商品列表
getProduct=(req,res)=>{
  let sql = "select * from product";
  let sqlArr = [];
  let callBack=(err,data)=>{
    if(err){
      console.log("something wrong with the connection...");
    }else{
      res.send({
        'code':200,
        'data':data
      })
    }
  }

  dbconfig.sqlConnect(sql,sqlArr,callBack);
}

//4. 获取历史订单
getOrders=(req,res)=>{
  console.log(req.session);
  let user_id = req.session.user_id;

  // let user_id = req.query;
  let sql = "select `product`.name, `product`.desc,`product`.`pic_url`,`order_item`.amount,`product`.price,`order`.total,`order`.create_time from `product` LEFT JOIN `order_item` on  `order_item`.product_id=`product`.id LEFT JOIN `order` on `order`.id=`order_item`.order_id where `order`.user_id=? and `order`.status = 1 order by `order`.create_time desc;";
  let sqlArr=[user_id];

  let callBack=(err,data)=>{
    if(err){
      console.log("something wrong with the connection...");
      console.log(err);
    }else{
      res.send({
        'code':200,
        'data':data
      })
    }
  }
  dbconfig.sqlConnect(sql,sqlArr,callBack);
}

//5. 获取购物车信息
getCart=(req,res)=>{
    if(!req.session.user_id){
        res.send({
            'code':400,
            'msg':'未登录！'
        })
    }
  else {
        let user_id = req.session.user_id;
        console.log(user_id);
        let sql = "select `product`.id,`product`.name, `product`.desc,`product`.`pic_url`,`order_item`.amount,`product`.price,`order`.total from `product` LEFT JOIN `order_item` on  `order_item`.product_id=`product`.id LEFT JOIN `order` on `order`.id=`order_item`.order_id where `order`.user_id=? and `order`.status = 0; ";

        let sqlArr=[user_id];
        console.log(typeof sqlArr[0]);
        let callBack=(err,data)=>{
            if(err){
                console.log("something wrong with the connection...");
                console.log(err);
            }else{
                res.send({
                    'code':200,
                    'data':data
                })
            }
        }
        dbconfig.sqlConnect(sql,sqlArr,callBack);

    }

}


//6. 更新购物车商品:增加或减少 api/updateCart?user_id=1&product_id=2&amount=3&total=200000
updateCart=(req,res)=>{
  // let user_id = Number(req.query.user_id);
    let user_id = req.session.user_id;
  let product_id = Number(req.query.product_id);
  let amount = Number(req.query.amount);
  let total = Number(req.query.total);
  console.log(req.query);
  let sql = "update `order_item` inner join `order` on `order`.id=`order_item`.order_id set `order_item`.amount=?  where `order`.user_id=? and `order`.status=0 and `order_item`.id = ?;update `order` set `order`.total = ? where `order`.user_id=? and `order`.status=0;";
  // let sql2 = "update `order` set `order`.total = ? where `order`.user_id=? and `order`.status=0";
  
  let sqlArr=[amount,user_id,product_id,total,user_id];
  console.log(sqlArr)
  
  let callBack=(err,data)=>{
    if(err){
      console.log("something wrong with the connection...");
      console.log(err);
    }else{
      res.send({
        'code':200,
        'data':data,
        'msg':'修改商品成功',
      })
    }
  }
  dbconfig.sqlConnect(sql,sqlArr,callBack)}



addCart=async (req,res)=>{
    // let user_id = Number(req.query.user_id);
    var user_id = req.session.user_id;
    let product_id = Number(req.query.product_id);
    //查找是否有order.status=0的order，没有则插入
    let sql='select id from `order` where `order`.status=0 and `order`.user_id=?; '
    let arr= [user_id]
    if(await dbconfig.SySqlConnect(sql,arr)==''){
        let sql_insert ='insert into`order` (user_id,status)VALUES(?,0);';
        let arr_insert=[user_id];
        await dbconfig.SySqlConnect(sql_insert,arr_insert);
    }


    //查找order中是否有该商品,返回order.id
    let sql0="SELECT `order_item`.order_id FROM order_item WHERE `order_item`.product_id=? AND `order_item`.order_id=(SELECT distinct `order`.id from `order`WHERE `order`.user_id=? AND `order`.status=0);";
    let sqlArr0=[product_id,user_id];
    let isExisted = await dbconfig.SySqlConnect(sql0,sqlArr0);
    console.log("isExisted");
    console.log(isExisted);


    //若不存在，则插入
    if(isExisted==''){
        console.log("要添加！");
        let sql2='insert into order_item set order_id=(select distinct `order`.id from `order` where `order`.user_id=? and `order`.status=0),product_id=?,amount=1;';//插入新的
        sqlArr2=[user_id,product_id];
        let result2 = await dbconfig.SySqlConnect(sql2, sqlArr2);
        console.log("result2"+result2);
        res.send({
            'code':200,
            'msg':'添加成功！'
        })
    }else {

        //改数量+1;查购物车详情（求total）
        let sql1 = "UPDATE `order_item` set `order_item`.amount = `order_item`.amount+1 WHERE `order_item`.order_id=(SELECT distinct `order`.id FROM `order` where `order`.user_id=? and `order`.status=0) and `order_item`.product_id=?;select `order`.id,amount, price from `product` inner join `order_item` on `order_item`.product_id=`product`.id inner join `order` on `order`.id=`order_item`.order_id where `order`.user_id=? and `order`.status=0;";
        let sqlArr1 = [user_id, product_id, user_id];
        console.log(sqlArr1);
        result1 = await dbconfig.SySqlConnect(sql1, sqlArr1);
        console.log(result1);


        let sql3 = "update `order` set `order`.total = ? where `order`.user_id=? and `order`.status=0";//更新total

        var total = 0;
        for (i = 0; i < result1[1].length; i++) {
            var num1 = Number(result1[1][i].amount);
            var num2 = Number(result1[1][i].price);
            total += num1 * num2;
        }

        //更新total

        sqlArr3 = [total, user_id];
        let result3 = await dbconfig.SySqlConnect(sql3, sqlArr3);
        if (result3.changedRows==0) {
            res.send({
                'code': 400,
                'msg': '没有更新！',
            })
        } else {
            res.send({
                'code': 200,
                'msg': '成功添加到购物车！'
            })
        }

    }
 }

// updateCart=(req,res)=>{
//   let {user_id} = req.query.user_id;
//   let {product_id} = req.query.product_id;
//   let {amount}=req.query.amount;
//   let {total}=req.query.total;
//   console.log(req.query);
//   let sql1 = "update `order_item` inner join `order` on `order`.id=`order_item`.order_id set `order_item`.amount=?  where `order`.user_id=? and `order`.status=0 and `order_item`.id = ?";
//   let sql2 = "update `order` set `order`.total = ? where `order`.user_id=? and `order`.status=0";
//   let sqlArr1=[amount,user_id,product_id];
//   let sqlArr2=[total,user_id];
//   console.log("ccc")
//   dbconfig.SySqlConnect(sql1,sqlArr1).then(()=>{
//     console.log("sssss")
//   //   dbconfig.sqlConnect(sql2,sqlArr2,(err,data)=>{
//   //     if(err){
//   //       console.log("something wrong with the connection...");
//   //       console.log(err);
//   //     }
//   //     else
//   //     {
//   //       res.send({
//   //         'code':200,
//   //         'msg':'更改商品条目成功！',
//   //         'affectedRows':data.affectedRows    
//   //       })
//   //       console.log("bbb")
//   //     }
//   // })
//   })

//   let callBack=(err,data)=>{
//     if(err){
//       console.log("something wrong with the connection...");
//       console.log(err);
//     }else{
//       // res.send({
//       //   'code':200,
//       //   'msg':'更改商品条目成功！',
//       //   'affectedRows':data.affectedRows
      
//       // })
//       console.log("aaa")
//       dbconfig.sqlConnect(sql2,sqlArr2,(err,data)=>{
//         if(err){
//           console.log("something wrong with the connection...");
//           console.log(err);
//         }
//         else
//         {
//           res.send({
//             'code':200,
//             'msg':'更改商品条目成功！',
//             'affectedRows':data.affectedRows    
//           })
//           console.log("bbb")
//         }
//     })
//   }

// }}





//7. 清空购物车
clearCart=(req,res)=>{
  let user_id =req.session.user_id;
  let purTime = new Date().Format("yyyy-MM-dd HH:mm:ss"); 
  let sql = "update `order` set `order`.status = 1 ,`order`.create_time = \'"+purTime+"\' WHERE `order`.user_id=? and `order`.status = 0;";
  let sqlArr=[user_id];
  console.log("清空购物车");
  console.log(user_id);
  let callBack=(err,data)=>{
    if(err){
      console.log("something wrong with the connection...");
      console.log(err);
    }else{
      res.send({
        'code':200,
        'msg':'成功清空购物车！'
      })
    }
  }
  dbconfig.sqlConnect(sql,sqlArr,callBack)
}



module.exports= {
  checkLogin,
    logOut,
  register,
  login,
  getProduct,
  getCart,
  updateCart,
    addCart,
  clearCart,
  getOrders
}



// getCart=(req,res)=>{
//   let sql = "select * from `order`";
//   let sqlArr = [];
//   let callBack= (err,data)=>{
//     if(err){
//       console.log("something wrong with the connection...");
//       console.log(err)
//     }else{
//       res.send({
//         'code':200,
//         'data':data
//       })
//     }
//   }
//   dbconfig.sqlConnect(sql,sqlArr,callBack);
// }