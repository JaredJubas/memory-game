'use strict';
const log = console.log; 

const changePass = document.querySelector('#changePassword')

// Add submit event listener
changePass.addEventListener('submit', changePassword)

function changePassword(e) {
    e.preventDefault();

    // Get inputs from the text fields
    const pass = document.querySelector('#newPass').value
    const rePass = document.querySelector('#newPassRe').value

    // No password enetered
    if (pass == '') {
        log("Password cannot be empty.")
        document.getElementById("error").style.display = "block"
        return
    }

    // Passwords do not match
    else if (pass !== rePass) {
        log("Passwords do not match.")
        document.getElementById("error").innerHTML = "Passwords do not match. Try again."
        document.getElementById("error").style.display = "block"
        return
    }

    const request = new XMLHttpRequest()
    const url = '/pass'
    request.open('PATCH', url)
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    request.onload = function() {
        // Check if request succeeded
        if (request.status === 200) {
            location.href = "user_page.html"
        } else if (request.status === 400) {
            log(request.response)
        } else {
            log('Server error')
        }
    }

    const username = sessionStorage.getItem('userName')
    const data = JSON.stringify({"username": username, "password": pass})
    request.send(data)
}