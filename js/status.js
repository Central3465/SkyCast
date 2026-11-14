function showstatus(msg, iserror = false) {
    const msg2 = document.getElementById("statusmsg");
    msg2.textContent = msg;
    statusbox.classList.remove("hidden", "error");
    if (iserror) {
        statusbox.classList.add("error");
    }
}


function hidestatus() {
    statusbox.classList.add("hidden");
}
