const btnUpdates = document.querySelectorAll('.js_btn_update')
const btnViews = document.querySelectorAll('.js_btn_view')
const form = document.querySelector('#update_form')
const ownerHTML = document.querySelector('#owner')
const orderInfoHTML = document.querySelector('#orderInfo')
const tableHTML = document.querySelector('#view_tbody')
const htmlOrder = document.querySelector('#htmlOrder')
const btnPrint = document.querySelector('#btn_print')

// nhấn nút update => show form => get data => điền dữ liệu
btnUpdates.forEach(btn => {
    btn.addEventListener('click', async (e) => {
        form.id.value = e.target.id
        let id = e.target.id
        const response = await fetch(`/admin/order/${id}`)
        const data = await response.json()
        form.orderStatus.value = data.order.orderStatus
    })
})

// CLICK SORT BY DATE
window.onload = () => {
    const dateField = document.querySelector("#dateField")
    console.log(dateField);
    $('#dateField').click()
}

//Click view detail order
btnViews.forEach(btn => {
    btn.addEventListener('click', async (e) => {
        let id = e.target.id.split("_")[1]
        displayQRCode(id)
        let img = document.querySelector('#img_qrcode')
        var dataUrl = document.getElementById('qrcode').toDataURL()
        img.src = dataUrl
        const response = await fetch(`/admin/order/${id}`)
        const data = await response.json()
        console.log(data);
        ownerHTML.innerHTML = `<p>Khách hàng: ${data.order.deliveryAdd.name}</p>
        <p>Sđt: ${data.order.deliveryAdd.phone}</p>
        <p>Địa chỉ: ${data.order.deliveryAdd.address}</p>
        <p>Số lượng: ${data.order.numOfProd}</p>
        <p>Tổng tiền: ${data.order.totalPrice.toLocaleString()}đ</p>
        `
        orderInfoHTML.innerHTML = `<p>ngày đặt hàng: ${data.order.orderDate}</p>
        <p>Trạng thái: ${convertNumberToOrderStatus(data.order.orderStatus)}</p>
        <p>Phương thức thanh toán: ${convertNumberToPaymentMethod(data.order.paymentMethod)}</p>
        <p>Hình thức giao hàng: ${convertNumberToTransportMethod(data.order.transportMethod)}</p>
        `
        tableHTML.innerHTML = `
        <tr>
          <td><a href="/products/${data.order.orderProd.code}">${data.order.orderProd.code}</a> </td>
          <td>${data.order.orderProd.name}</td>
          <td>${data.order.orderProd.discount}%</td>
          <td>${data.order.orderProd.price.toLocaleString()}đ</td>
        </tr>`
       
    })
})


// click nút in
btnPrint.addEventListener('click',(e)=>{
    var divContents = document.getElementById("htmlOrder").innerHTML;
    var dataUrl = document.getElementById('qrcode').toDataURL()

            var a = window.open('', '', 'height=900, width=1300');
            a.document.write('<html>');
            a.document.write(divContents);
            a.document.write('</body></html>');
            a.document.close();
            a.print();
})

// đổi số sang trạng thái đơn hàng
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

// hiển thị QR code 
function displayQRCode(id) {
    var canvas = document.getElementById('qrcode')
    canvas.width = 700;
    canvas.height = 700;
    const imgDim = { width: 30, height: 30 }; //logo dimention
    var context = canvas.getContext("2d");
    var imageObj = new Image();
    imageObj.src = "/images/logo.jpg";

    imageObj.onload = function () {
        context.drawImage(
            imageObj,
            canvas.width / 2 - imgDim.width / 2,
            canvas.height / 2 - imgDim.height / 2,
            imgDim.width,
            imgDim.height
        );
    };

    QRCode.toCanvas(canvas, `${window.location.hostname}/order?id=${id}`, function (error) {
        if (error) console.error(error)
        console.log('success!');
    })
 
}