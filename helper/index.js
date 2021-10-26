const AccountModel = require('../models/account.model')
const UserModel = require('../models/user.model')
const VerifyModel = require('../models/verify.model')
const ProductModel = require('../models/product.model')
const LaptopModel = require('../models/laptop.model')
const constants = require('../constants/index')


//fn: tạo mã xác thực
const generateVerifyCode = (numberOfDigits) => {
    //random một số từ 1 -> 10^numberOfDigits
    const n = parseInt(numberOfDigits);
    const number = Math.floor(Math.random() * Math.pow(10, n)) + 1;
    let numberStr = number.toString();
    const l = numberStr.length;
    for (let i = 0; i < 6 - l; ++i) {
        numberStr = '0' + numberStr;
    }
    return numberStr;
};

//fn: kiểm tra mã xác thực
const isVerifyEmail = async (email, verifyCode) => {
    try {
        const res = await VerifyModel.findOne({ email });
        if (res) {
            const { code, dateCreated } = res;
            if (code !== verifyCode) return false;
            const now = Date.now();
            // kiểm tra mã còn hiệu lực hay không
            if (now - dateCreated > constants.VERIFY_CODE_TIME_MILLISECONDS)
                return false;
            return true;
        }
        return false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// fn: chuyển address id thành address string
const convertAddress = async (address) => {
    try {
        let result = '';
        const { province, district, wards, street, details } = address;
        const data = await AddressModel.findOne({ id: province.toString() });
        if (data) {
            const { districts } = data;
            const proName = data.name;

            const dis = districts.find((item) => {
                return item.id === district.toString();
            });

            if (dis) {
                const disName = dis ? dis.name : '';
                const ward = dis.wards.find((item) => item.id == wards.toString());
                const wName = ward.prefix + ' ' + ward.name;

                const s = dis.streets
                    ? dis.streets.find((item) => item.id == street.toString())
                    : null;
                const sName = s ? s.prefix + ' ' + s.name : '';
                result =
                    details +
                    ', ' +
                    sName +
                    ', ' +
                    wName +
                    ', ' +
                    disName +
                    ', ' +
                    proName;
            } else {
                return proName;
            }
        }
        return result;
    } catch (error) {
        console.log(error);
        return '';
    }
};

//fn: chuyển loại sản phẩm từ số thành Model
const convertProductType = (type = 0) => {
    switch (type) {
        case 0:
            return LaptopModel;
        //   case 1:
        //     return DiskModel;
        //   case 2:
        //     return DisplayModel;
        //   case 3:
        //     return MainboardModel;
        //   case 4:
        //     return RamModel;
        //   case 5:
        //     return MobileModel;
        //   case 6:
        //     return BackupChargerModel;
        //   case 7:
        //     return HeadphoneModel;
        //   case 8:
        //     return KeyboardModel;
        //   case 9:
        //     return MonitorModel;
        //   case 10:
        //     return MouseModel;
        //   case 11:
        //     return RouterModel;
        //   case 12:
        //     return SpeakerModel;
        //   case 13:
        //     return CameraModel;
        //   case 14:
        //     return WebcamModel;
        default:
            return LaptopModel;
    }
};

// Tính trung bình đánh giá
const hanlderRate = (arr) => {
    var rate = []
    for (var i = 1; i <= 5; i++) {
        rate.push(arr[i - 1] * i)
    }
    var avg = arr[0] + arr[1] + arr[2] + arr[3] +arr[4]
    if(avg!=0){
        let result = rate.reduce((p, c) => p + c, 0) / avg;
        return result.toFixed(2)
    }
    return 0
}
// đổi loại sản phẩm từ số thành string
const converTypeToString = (number = 0) => {
    switch (number) {
        case 0:
            return "Laptop";
        default:
            return "Laptop";
    }
}

// đổi số seris thành chữ
const convertSerisToString = (number) => {
    // 0 - core i3, 1 - core i5, 2 - core i7, 3 - core i9,
    // 4 - Ryzen 3, 5 - Ryzen 5, 6 - Ryzen 7, 7 - Pentium, 8 - Celeron, 9 -M1
    switch (number) {
        case 0:
            return "i3";
        case 1:
            return "i5";
        case 2:
            return "i7";
        case 3:
            return "i9";
        case 4:
            return "Ryzen 3";
        case 5:
            return "Ryzen 5";
        case 6:
            return "Ryzen 7";
        case 7:
            return "Pentium";
        case 8:
            return "Celeron";
        case 9:
            return "M1";
        default:
            return "i3";
    }
}

// đổi số => tình trạng đơn hàng
const convertNumberToOrderStatus = (number = 0) => {
    switch (number) {
        case 0:
            return "Đặt hàng thành công"

        case 1:
            return "GENY đã tiếp nhận"

        case 2:
            return "Đang lấy hàng"

        case 3:
            return "Đóng gói xong"

        case 4:
            return "Bàn giao vận chuyển"

        case 5:
            return "Đang vận chuyển"
        case 6:
            return "Giao hàng thành công"
    }
}

// đổi số => hình thức thanh toán
const convertNumberToPaymentMethod = (number = 0) => {
    switch (number) {
        case 0:
            return "Tiền mặt"

        case 1:
            return "Online"

        default:
            return "Tiền mặt"
    }
}
// đổi số => hình thức giao hàng
const convertNumberToTransportMethod = (number = 0) => {
    switch (number) {
        case 0:
            return "tiêu chuẩn"

        case 1:
            return "tiết kiệm"
        case 2:
            return "nhanh"

    }
}

module.exports = {
    generateVerifyCode,
    isVerifyEmail,
    convertAddress,
    convertProductType,
    hanlderRate,
    converTypeToString,
    convertSerisToString,
    convertNumberToOrderStatus,
    convertNumberToPaymentMethod,
    convertNumberToTransportMethod,
};

