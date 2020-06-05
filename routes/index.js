var express = require('express');
var router = express.Router();
var product = require('../controllors/Controllers');


/* GET home page. */

router.get('/checkLogin',product.checkLogin);
router.get('/logOut',product.logOut);
router.get('/register',product.register);
router.get('/login',product.login);
router.get('/getProduct',product.getProduct);
router.get('/getOrders',product.getOrders);
router.get('/updateCart',product.updateCart);
router.get('/addCart',product.addCart);
router.get('/getCart',product.getCart);
router.get('/clearCart',product.clearCart);




module.exports = router;
