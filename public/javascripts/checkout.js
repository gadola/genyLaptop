const tableCart = document.querySelector("#table_cart")
const tableTotalCart = document.querySelector("#total_table_cart")

const btnCheckout = document.querySelector("#btn_checkout")
window.onload = LoadPage()

function LoadPage() {
    var cart = JSON.parse(localStorage.getItem('cart'))
    cart.forEach(item => {
        displayItem(tableCart, item)
    });
    displayTotalPrice(cart, tableTotalCart)
    handlerCheckoutSubmit(cart)
    displayQRCode()
}

// submit order
function handlerCheckoutSubmit(cart) {
    let shipMethod = document.querySelector("input[name='shipMethod']:checked")
    let paymentMethod = document.querySelector("input[name='paymentMethod']:checked")
    let note = document.querySelector("textarea[name='note']")

    console.log('shipMethod', shipMethod.value, "paymentMethod", paymentMethod.value);
    var data = {
        data: [...cart],
        shipMethod: shipMethod.value,
        paymentMethod: paymentMethod.value,
        note: note.value,
    }

    btnCheckout.addEventListener('click', (e) => {
        console.log("submit order nè", data);
        fetchPostOrder(data).then(data => {
            console.log(data);
            alert("Đặt hàng thành công!")
            localStorage.removeItem('cart')
            window.location.href = "/user"
        })
            .catch(error => {
                alert(error.message)
                localStorage.removeItem('cart')
                window.location.href = "/products/cart"
            })
    })
}

const fetchPostOrder = async (cart) => {
    let url = "/products/checkout"
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cart)
    })
    if (!response.ok) {
        const message = await response.json()
        throw new Error(message);
    }
    const data = await response.json()
    return data
}

const fetchData = async (url) => {
    const response = await fetch(url)
    const data = await response.json()
    return data
}


// hiển thị các sản phẩm trong giỏ
function displayItem(table, item) {
    var tr = document.createElement('tr')
    var textHtml = `<td><a href="/products/${item.code}"><img alt="" width="150px" height="150px" src="${item.avt}"></a></td>
                    <td style="font-size:15px"><a href="/products/${item.code}">${item.name}</a></td>
                    <td style="font-size:15px">${item.price.toLocaleString()}đ</td>
                    <td style="font-size:15px">${item.number}</td>
                    <td style="font-size:15px"><b>${(item.number * item.price).toLocaleString()}đ</b></td>`
    tr.innerHTML = textHtml
    table.appendChild(tr)
}

// hiển thị tổng tiền cần thanh toán
function displayTotalPrice(cart, table) {
    var tr = document.createElement('tr')
    let total = 0
    cart.forEach(item => {
        total += item.price * item.number
    })
    var textHtml = `
                    <td style="font-size:15px">${total.toLocaleString()}đ</td>
                    <td style="font-size:15px">Miễn phí</td>
                    <td style="font-size:15px"><b>${total.toLocaleString()}đ</b></td>`
    tr.innerHTML = textHtml
    table.appendChild(tr)

}


// hiển thị QR code momo
function displayQRCode() {
    var canvas = document.getElementById('qrcodeMomo')
    canvas.width = 700;
    canvas.height = 700;
    const imgDim = { width: 30, height: 30 }; //logo dimention
    var context = canvas.getContext("2d");
    var imageObj = new Image();
    imageObj.src = "/images/momo_logo.png";

    imageObj.onload = function () {
        context.drawImage(
            imageObj,
            canvas.width / 2 - imgDim.width / 2,
            canvas.height / 2 - imgDim.height / 2,
            imgDim.width,
            imgDim.height
        );
    };

    var cart = JSON.parse(localStorage.getItem('cart'))
    let total = 0
    cart.forEach(item => {
        total += item.price * item.number
    })

    // QRCode.toCanvas(canvas,`071210386894952103069704150410Vietinbank0522CN 7 - TP HCM - HOI SO10037040102100819PHAM MINH HOANG NAM02021000020163048CCB`, function (error) {
    //     if (error) console.error(error)
    //     console.log('success!');
    // })
    QRCode.toCanvas(canvas,`2|99|0855457078|PHAM MINH HOANG NAM|efert269@gmail.com|0|0|${total}`, function (error) {
        if (error) console.error(error)
        console.log('success!');
    })
    const div = document.getElementById('thongtinchutaikhoan')
    div.innerHTML = ""
    let p = document.createElement('small')
    p.textContent = "Phạm Minh Hoàng Nam - 0855457078"
    div.appendChild(p)
}

$("#paymentCOD").click(function(){
    $('#qrcodeMomo').hide()
    $('#thongtinchutaikhoan').hide()
    $('#btnVerifyPayment').hide()

})
$("#paymentOnline").click(function(){
    $('#qrcodeMomo').show()
    $('#thongtinchutaikhoan').show()
    $('#btnVerifyPayment').show()

})


