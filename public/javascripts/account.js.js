const btnSend = document.querySelector('#btnSendVerifyCode')
const inpEmail = document.querySelector('#email')

async function fetchPostSendVerifyCode() {
    let email = inpEmail.value
    console.log("tiến hành gửi email");
    let url = '/account/verify/forgot'
    const response = await fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
    alert("Đã gửi mã xác nhận, vui lòng check mail")
    return response.json()
}

btnSend.addEventListener('click', fetchPostSendVerifyCode)