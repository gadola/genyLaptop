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
}

// submit order
function handlerCheckoutSubmit(cart) {
    let shipMethod = document.querySelector("input[name='shipMethod']:checked")
    let paymentMethod = document.querySelector("input[name='paymentMethod']:checked")
    let note = document.querySelector("input[name='note']")

    console.log('shipMethod',shipMethod.value, "paymentMethod",paymentMethod.value);
    var data = {
        data: [...cart],
        shipMethod:shipMethod.value,
        paymentMethod:paymentMethod.value,
        note:note.value,
    }

    btnCheckout.addEventListener('click', (e) => {
        console.log("submit order nè",data);
        fetchPostOrder(data).then(data=>{
            console.log(data);
            alert("Đặt hàng thành công")
            localStorage.removeItem('cart')
            window.location.href = "/"
        })
        .catch(error=>{
            console.log(error);
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
        const message = `Lỗi đặt hàng: ${response.json()}`;
        throw new Error(message);
    }
    const data = await response.json()
    return data
}


// hiển thị các sản phẩm trong giỏ
function displayItem(table, item) {
    var tr = document.createElement('tr')
    var textHtml = `<td><a href="/products/${item.code}"><img alt="" width="150px" height="150px" src="${item.avt}"></a></td>
                    <td><a href="/products/${item.code}">${item.name}</a></td>
                    <td>${item.price.toLocaleString()}đ</td>
                    <td>${item.number}</td>
                    <td>${(item.number * item.price).toLocaleString()}đ</td>`
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
                    <td>${total.toLocaleString()}đ</td>
                    <td>Miễn phí</td>
                    <td>${total.toLocaleString()}đ</td>`
    tr.innerHTML = textHtml
    table.appendChild(tr)

}


