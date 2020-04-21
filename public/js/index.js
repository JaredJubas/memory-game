'use strict';

const logIn = document.querySelector('#signIn')

// Automatically resets current session
sessionStorage.setItem('userName', '')
sessionStorage.setItem('admin', false)

// Add submit event listener
logIn.addEventListener('submit', signIn)

function signIn(e) {
    e.preventDefault();

    // Get inputs from the text fields
    const username = document.querySelector('#uName').value
    const password = document.querySelector('#uPass').value

    const request = new XMLHttpRequest()
    const url = '/login'
    request.open('POST', url, true)
    request.onload = function (e) {
        // Make sure request is complete
        if (request.readyState === 4) {
            // Check that request succeeded
            if (request.status === 200) {
                const body = JSON.parse(request.response)
                sessionStorage.setItem('userName', username);
                sessionStorage.setItem('admin', body.admin)
                location.href = "user.html"
            } else {
                console.error(request.statusText)
                document.getElementById("error").style.display = "block"
            }
        }
    }
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    const data = JSON.stringify({"username":username,"password":password})
    request.send(data)
}
