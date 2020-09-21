jQuery(function ($) {
    const realBtn = document.getElementById("img-input");
    const formBtn = document.getElementById("img-btn");
    const click = document.getElementById("img-click");

    click.onclick = () => {
        realBtn.click();
    }
    realBtn.addEventListener("change", () => {
        if (realBtn.value) {
            formBtn.click();
        }
    })
});
