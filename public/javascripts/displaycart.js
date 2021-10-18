const tableCart = document.querySelector("#table_cart")
const pPricePay = document.querySelector("#price_pay")
const divVerify = document.querySelector("#div_verify")
const btnCheckout = document.querySelector("#checkout")
window.onload = LoadPage()

function LoadPage() {
    var cart = JSON.parse(localStorage.getItem('cart'))
    if (!cart) {
        tableCart.innerHTML = "<h2>Bạn chưa thêm sản phẩm nào! Nhấn vào <a href='/'>đây</a> để tới trang sản phẩm</h2>"
        divVerify.innerHTML = ""
        return
    }
    cart.forEach(item => {
        displayItem(tableCart, item)
    });
    displayTotalPrice(cart, tableCart)
    handlerEvenEditNumber(cart)
    displayTotalPriceByVAT(cart)
    handlerEvenRemoveItem(cart)
    // handlerCheckoutSubmit(cart)
}
// 
function handlerEvenRemoveItem(cart) {
    const iconRemove = document.querySelectorAll('.nutxoa')
    console.log(iconRemove);
    iconRemove.forEach(remove => {
        remove.addEventListener('click', (e) => {
            let id = e.target.id.split("_")[1]
            console.log(id);
            for (let i = 0; i < cart.length; i++) {
                if (cart[i].id == id) {
                    cart.splice(i, 1)
                    break
                }
            }
            localStorage.setItem('cart', JSON.stringify(cart))
            tableCart.innerHTML = `<thead>
                                        <tr>
                                            <th>Xóa</th>
                                            <th>Mặt hàng</th>
                                            <th> Tên Sản Phẩm </th>
                                            <th> Số Lượng </th>
                                            <th> Giá Tiền </th>
                                            <th> Tổng </th>
                                        </tr>
                                    </thead>`
            LoadPage()
        })
    })

}
function handlerEvenEditNumber(cart) {
    const inpsNumber = document.querySelectorAll('.input-mini')
    inpsNumber.forEach(inp => {
        inp.addEventListener('input', (e) => {
            let id = e.target.id
            let newNumber = e.target.value
            for (let i = 0; i < cart.length; i++) {
                if (cart[i].id == id) {
                    if (newNumber <= 0) {
                        cart.splice(i, 1)
                    } else {
                        cart[i].number = parseInt(newNumber)
                    }
                    break
                }
            }
            localStorage.setItem('cart', JSON.stringify(cart))
            tableCart.innerHTML = `<thead>
                                        <tr>
                                            <th>Xóa</th>
                                            <th>Mặt hàng</th>
                                            <th> Tên Sản Phẩm </th>
                                            <th> Số Lượng </th>
                                            <th> Giá Tiền </th>
                                            <th> Tổng </th>
                                        </tr>
                                    </thead>`
            LoadPage()
        })
    })

}

function handlerCheckoutSubmit(cart) {
    let totalProducts = 0
    let vat = 0
    let total = 0
    for (let i = 0; i < cart.length; i++) {
        totalProducts += cart[i].number * cart[i].price
    }
    vat = totalProducts * 9 / 100 + 50000 // thuế môi trường + vat
    total = vat + totalProducts

    var data = {...data}

}

const fetchPostOrder = async (cart) => {
    let url = ""
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body:JSON.stringify(cart)
    })
    if (!response.ok) {
        const message = `Lỗi đặt hàng: ${response.status}`;
        throw new Error(message);
    }
    const data = await response.json()
    return data
}



function displayItem(table, item) {
    var tr = document.createElement('tr')
    // var tdXoa = document.createElement('td')
    // var tdAvt = document.createElement('td')
    // var tdName = document.createElement('td')
    // var tdPrice = document.createElement('td')
    // var tdNumber = document.createElement('td')
    // var tdTotal = document.createElement('td')
    // tr.appendChild(tdXoa)
    // tr.appendChild(tdAvt)
    // tr.appendChild(tdName)
    // tr.appendChild(tdPrice)
    // tr.appendChild(tdNumber)
    // tr.appendChild(tdTotal)
    // table.appendChild(tr)
    // tdXoa.innerHTML=`<i style="color:red;cursor:pointer;font-size:20px" id="remove_${item.id}" class="fa fa-trash-o nutxoa" aria-hidden="true"></i>`
    // tdAvt.innerHTML = `<a href="/products/${item.code}"><img alt="" width="150px" height="150px" src="${item.avt}"></a>`
    // tdName.innerHTML = `<a href="/products/${item.code}">${item.name}</a>`
    // tdPrice.innerHTML = `${item.price.toLocaleString()}đ`
    // tdNumber.innerHTML = `<input type="number" id="${item.id}" value="${item.number}" min="0" class="input-mini">`
    // tdTotal.innerHTML = `${(item.number * item.price).toLocaleString()}đ`
    var textHtml = `<td><i style="color:red;cursor:pointer;font-size:20px" id="remove_${item.id}" class="fa fa-trash-o nutxoa" aria-hidden="true"></i></td>
                    <td><a href="/products/${item.code}"><img alt="" width="120px" height="120px" src="${item.avt}"></a></td>
                    <td style="font-size:15px"><a href="/products/${item.code}">${item.name}</a></td>
                    <td style="font-size:15px">${item.price.toLocaleString()}đ</td>
                    <td><input type="number" id="${item.id}" value="${item.number}" min="0" class="input-mini"></td>
                    <td style="font-size:15px">${(item.number * item.price).toLocaleString()}đ</td>`
    tr.innerHTML = textHtml
    table.appendChild(tr)
}

function displayTotalPrice(cart, table) {
    var tr = document.createElement('tr')
    var tdXoa = document.createElement('td')
    var tdAvt = document.createElement('td')
    var tdName = document.createElement('td')
    var tdPrice = document.createElement('td')
    var tdNumber = document.createElement('td')
    var tdTotal = document.createElement('td')
    tr.appendChild(tdXoa)
    tr.appendChild(tdAvt)
    tr.appendChild(tdName)
    tr.appendChild(tdPrice)
    tr.appendChild(tdNumber)
    tr.appendChild(tdTotal)
    table.appendChild(tr)
    let total = 0
    cart.forEach(item => {
        total += item.price * item.number
    })
    tdTotal.innerHTML = `<strong style="font-size:15px" >${total.toLocaleString()}đ</strong>`
}


function displayTotalPriceByVAT(cart) {
    let totalProducts = 0
    cart.forEach(item => {
        totalProducts += item.price * item.number
    })

    pPricePay.innerHTML = `<strong>Tiền Hàng</strong>: ${totalProducts.toLocaleString()}đ<br>
                            <strong>Chi phí vận chuyển</strong>: Miễn phí<br>
                            <strong> Tổng </strong>: ${totalProducts.toLocaleString()}đ<br>`
    // <input type="hidden" name="totalProducts" id="" value="${totalProducts}">
    // <input type="hidden" name="vat" id="" value="${thuemoitruong + vat}">
    // <input type="hidden" name="total" id="" value="${total}">`

}