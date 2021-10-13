const form = document.querySelector("#form_add_to_cart")

function findAndUpdateNumberInCart(cart,item){
    let bool = false // item đó có trong cart k?
    if(!cart){ // cart rỗng => push
        cart = []
        cart.push(item)
        console.log(cart);
        return cart
    }
    // check if exist in cart => update number
    for (let i = 0; i < cart.length; i++) {
        if(cart[i].id == item.id){
            console.log("cart[i].id:",cart[i].id);
            console.log("item.id:",item.id);
            cart[i].number += item.number
            bool = true
        }
    }
    // if non exist => push 
    if(!bool){
        cart.push(item)
    }
    return cart
}

function addToCart(cart){
    let cartString = JSON.stringify(cart)
    localStorage.setItem('cart',cartString)
}

form.addEventListener("submit",e=>{
    e.preventDefault()
    let id = form._id.value
    let number = parseInt(form.number.value)
    let code = form.code.value
    let avt = form.avt.value
    let price = parseInt(form.price.value)
    let name = form.name.value
    let item = {
        id:id,
        code:code,
        avt:avt,
        name:name,
        price:price,
        number:number,
    }
    var cart = JSON.parse(localStorage.getItem('cart')) // mảng ds laptop trong cart
    cart = findAndUpdateNumberInCart(cart, item)
    addToCart(cart)
    return alert("Thêm vào giỏ thành công")
})