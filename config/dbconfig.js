const mysql = require('mysql');
module.exports = {
	config:{
		host:'',
		port:'',
		user:'',
		password:'',
		database:'',
		multipleStatements: true
	},

	sqlConnect:function(sql,sqlArr,callBack){
		var pool =mysql.createPool(this.config)
		pool.getConnection((err,conn)=>{
			console.log('start to connect...');
			if(err){
				console.log('fail to connect to db');
				return;
			}
			conn.query(sql,sqlArr,callBack);

			conn.release();
			callBack
		})
	},

	
    //promise 回调
    SySqlConnect:function(sySql,sqlArr){
        return new Promise((resolve,reject)=>{
            var pool = mysql.createPool(this.config);
            pool.getConnection(function(err,conn){
                console.log('123');
                if(err){
                    reject(err);
                }else{
                    conn.query(sySql,sqlArr,(err,data)=>{
                        if(err){
                            reject(err)
                        }else{
                            resolve(data);
                        }
                        conn.release();
                    });                    
                }
                
            })
        }).catch((err)=>{
                console.log(err);
            })
    }
}