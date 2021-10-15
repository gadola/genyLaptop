
const form = document.querySelector('#productForm')
const iconsEdit = document.querySelectorAll('.js_icon_edit')
const iconsView = document.querySelectorAll('.js_icon_view')
const iconsDelete = document.querySelectorAll('.js_icon_delete')


const fechGetProduct = async (url) => {
    const response = await fetch(url)
    const data = response.json()
    return data
}
const fechPostProduct = async (url, data) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    const result = response.json()
    return result
}

const insertDataToForm = (product, productDetail) => {
    form.id.value = product._id
    form.code.value = product.code
    form.name.value = product.name
    form.price.value = product.price
    form.type.value = product.type
    form.brand.value = product.brand
    form.stock.value = product.stock
    form.discount.value = product.discount
}

// thêm sự kiện click => auto fill data để update sản phẩm
iconsEdit.forEach(item => {
    item.addEventListener('click',async (e) => {
        console.log("click ", e.target.id);
        const id = e.target.id.split("_")[1]
        let url = `/admin/products/${id}`
        fechGetProduct(url).then(data => {
            console.log(data);
            insertDataToForm(data)
        })
        console.log("click ", id);
    })
})

// thêm sự kiện click => xoá sản phẩm
iconsDelete.forEach(item => {
    item.addEventListener('click', (e) => {
        console.log("click ", e.target.id);
        const id = e.target.id.split("_")[1]
        let url = '/admin/products/delete'
        if (confirm("Bạn có muốn xoá?")){
            fechPostProduct(url, { id: id }).then(data => {
                window.location.href = "/"
            })
        }
    })
})