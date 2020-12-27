export const hideAlert = () => {
    const el = document.querySelector(".alert");
    if(el) {
        el.parentElement.removeChild(el);
    }
}

export const showAlert = (type, text) => {
    hideAlert();
    const alertBox = `<div class="alert alert--${type}">${text} </div>`;
    document.querySelector("body").insertAdjacentHTML("afterbegin", alertBox);
    window.setTimeout(hideAlert, 5000);
}
