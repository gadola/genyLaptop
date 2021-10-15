const btnUpdates = document.querySelectorAll('.js_btn_update')
const form = document.querySelector('#update_form')

btnUpdates.forEach(btn => {
    btn.addEventListener('click', (e) => {
        form.id.value=e.target.id
        console.log(e.target.id);
    })
})
