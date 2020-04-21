'use strict';
const log = console.log; 

// Everything needed from the HTML
const create = document.querySelector('#createAccount')

// Add submit event listener
create.addEventListener('submit', createAccount)

function createAccount(e) {
    e.preventDefault();

    // Get inputs from the text fields
    const username = document.querySelector('#uName').value
    const password = document.querySelector('#uPass').value
    const enterPassword = document.querySelector('#uRePass').value

    // Check that no input is blank
    if (password == '' || username == '') {
        log("Please enter a valid username and password")
        document.getElementById("error").style.display = "block"
        return
    }

    // Make sure passwords match
    else if (password != enterPassword) {
        log("Passwords do not match. Try again.")
        document.getElementById("error").innerHTML = "Passwords do not match. Try again."
        document.getElementById("error").style.display = "block"
        return
    }

    // Store data
    const request = new XMLHttpRequest()
    const url = '/signup'
    request.open('POST', url)
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    request.onload = function() {
        // Check if request succeeded
        if (request.status === 200) {
            // Store the user as currently logged in
            sessionStorage.setItem('userName', username);
            location.href = "user_page.html"
        } else if (request.status === 400) {
            log(request.response)
            document.getElementById("error").innerHTML = "User already exists."
            document.getElementById("error").style.display = "block"
        } else {
            console.log('Server error')
        }
    }

    const data = JSON.stringify({"username":username,"password":password,"admin":false})
    request.send(data)
    
}
