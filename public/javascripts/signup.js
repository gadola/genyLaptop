const btnSend = document.querySelector('#btnSendVerifyCode')
const inpEmail = document.querySelector('#email')

const fetchPostSendVerifyCode = async () => {
    let email = inpEmail.value
    console.log("tiến hành gửi email");
    let url = '/account/verify'
    const response = await fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ email: email })
    })
    if (!response.ok) {
        const error = "mail đã được sử dụng"
        throw new Error(error);
    }
    const data = await response.json()
    return data
}

btnSend.addEventListener('click', e => {
    fetchPostSendVerifyCode()
        .then(data => {
            alert("Đã gửi mã thành công!")
        })
        .catch(error => {
            alert(error)
        })
})
