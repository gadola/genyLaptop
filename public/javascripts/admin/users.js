const iconsDele = document.querySelectorAll('.js_icon_delete')
const iconsUpdate = document.querySelectorAll('.js_icon_update')
const form =  document.querySelector('#userForm')
const fetchPost = async (data)=>{
    const response = await fetch('/admin/users/delete',{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    if(!response.ok){
        const message = await response.json()
        throw new Error(message)
    }
    const result = await response.json();
    return result
}

// thêm sự kiện khi click icon delete
iconsDele.forEach(icon =>{
    icon.addEventListener('click', e=>{
        alert("Bạn có muốn xoá người dùng này")
        console.log(e.target.id);
        let id = e.target.id
        let data = {
            id:id
        }
        alert("Xoá thành công!")
        window.location.href = "/admin/users"
        // fetchPost(data).then(data=>{
        //     window.location.href = "/admin/users"
        // })
        // .catch(error=>{
        //     alert(error.message)
        // })
    })
})


// click icon update => show model form => update info user
iconsUpdate.forEach(icon=>{
    icon.addEventListener('click',async (e)=>{
        let id=e.target.id
        const response = await fetch(`/admin/user/${id}`)
        const data = await response.json()
        form.id.value = data.user._id
        form.email.value = data.account.email
        form.fullName.value = data.user.fullName
        form.phone.value = data.user.phone
        form.address.value = data.user.address
        form.gender.value = data.user.gender
        form.birthday.value = data.user.birthday
    })

})

