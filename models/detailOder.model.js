const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const detailOrderSchema = new Schema({
    // _id của đơn hàng (Order)
    idOrder: {
        type: Schema.Types.ObjectId,
        ref: 'order',
        required: true
    },
    // sản phẩm lúc mua
    orderProd:{
        id:{type:Schema.Types.ObjectId, required:true, ref:'laptop'},
        code:{type:String, required:true, trim:true},
        name:{type:String, required:true, trim:true},
        price:{type:Number, required:true, default:0},
        discount:{type:Number, required:true, default:0}
    },
    //Số lượng
    numOfProd:{type:Number, required:true, default:1}

})

const DetailOrderModel = mongoose.model('detailOrder', detailOrderSchema, "detailOrders")

module.exports = DetailOrderModel;
