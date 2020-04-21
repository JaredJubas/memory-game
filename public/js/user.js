'use strict';

// Get the user currently logged in 
const uName = sessionStorage.getItem('userName');

// Change the title to be the logged in user
const title = document.querySelector('#userName');
title.appendChild(document.createTextNode(uName));
