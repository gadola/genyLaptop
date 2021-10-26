const iconsDele = document.querySelectorAll('.js_icon_delete')
const iconsUpdate = document.querySelectorAll('.js_icon_edit')
const updateAdminForm = document.querySelector('#updateAdminForm')

const fetchPost = async (data, url) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    if (!response.ok) {
        const message = await response.json()
        throw new Error(message)
    }
    const result = await response.json();
    return result
}

const fetchGet = async (url) => {
    const response = await fetch(url)
    if (!response.ok) {
        const message = await response.json()
        throw new Error(message)
    }
    const data = await response.json()
    return data
}

// thêm sự kiện khi click icon delete
iconsDele.forEach(icon => {
    let url = '/admin/users/delete'
    icon.addEventListener('click', e => {
        if (confirm("Bạn có muốn xoá người dùng này")) {
            let id = e.target.id
            let data = {
                id: id
            }
            fetchPost(data, url).then(data => {
                alert("Xoá thành công!")
                window.location.href = "/admin/admins"
            })
                .catch(error => {
                    alert(error.message)
                })
        }
    })
})


/// thêm sự kiện cập nhật khi click icon update
iconsUpdate.forEach(icon => {
    icon.addEventListener('click', e => {
        let id = e.target.id.split("_")[1]
        fetchGet(`/admin/user/${id}`).then(data => {
            console.log(data);
            var account = data.account
            var user = data.user
            updateAdminForm.email.value = account.email
            // updateAdminForm.password.value = account.password
            // updateAdminForm.repassword.value = account.password
            updateAdminForm.fullName.value = user.fullName
            updateAdminForm.phone.value = user.phone
            updateAdminForm.birthday.value = user.birthday
            updateAdminForm.address.value = user.address
            updateAdminForm.gender.value = user.gender

        })

    })
})