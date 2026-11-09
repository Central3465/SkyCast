const seform = document.getElementById("sform");
const cityinput = document.getElementById("cityinput");
const searchbtn = document.getElementById("searchbtn");
const weathersection = document.getElementById("weather");
const statusbox = document.getElementById("status");

const weathercodes = {
    0: ["Clear sky", "☀️"],
    1: ["I'll do it later", "😫"]
}

function showstatus(msg, iserror = false) {
    statusbox.textContent = msg;
    statusbox.classList.remove("hidden", "error");
    if (iserror) {
        statusbox.classList.add("error");
    }
}

function hidestatus() {
    statusbox.classList.add("hidden");
}