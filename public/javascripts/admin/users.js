const iconsDele = document.querySelectorAll('.js_icon_delete')

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

// thêm sự kiện khi click
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