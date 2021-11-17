const btnUpdates = document.querySelectorAll('.js_btn_update')
const form = document.querySelector('#update_form')


// nhấn nút update => show form => get data => điền dữ liệu
btnUpdates.forEach(btn => {
    btn.addEventListener('click',async (e) => {
        form.id.value=e.target.id
        let id = e.target.id
        const response = await fetch(`/admin/order/${id}`)
        const data = await response.json()
        form.orderStatus.value=data.order.orderStatus
    })
})

// CLICK SORT BY DATE
window.onload = ()=>{
    const dateField = document.querySelector("#dateField")
    console.log(dateField);
    $('#dateField').click()
}

