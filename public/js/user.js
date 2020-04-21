'use strict';

sessionStorage.setItem('userName', 'user');

const uName = sessionStorage.getItem('userName');

const title = document.querySelector('#userName');
title.appendChild(document.createTextNode(uName));
