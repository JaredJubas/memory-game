'use strict';

const back = document.querySelector('#back')
const scores = document.querySelector('#score_table')

createScoreTable();

back.addEventListener('click', backToUser)

function backToUser(e) {
    e.preventDefault();

    location.href = "user_page.html"
}

function createScoreTable() {
	// Use GET request to get all scores
	const url = '/score';
	fetch(url).
	then((res) => {
		if (res.status === 200) {
			return res.json()
		} else {
			alert('Could not get scores')
		}
	})
	.then((allScores) => {
		// Display all scores
		console.log(allScores);
		for (let i = 0; i < allScores.length; i++) {
			const new_row = createRow(i, allScores)
			scores.appendChild(new_row)
		}
	}).catch((error) => {
		console.log(error)
	})
}

function createRow(i, allScores) {
	const new_row = document.createElement("tr");
	
	const cell1 = new_row.insertCell(0);
	const cell2 = new_row.insertCell(1);
	const cell3 = new_row.insertCell(2);
	const cell4 = new_row.insertCell(3);

	const rank = document.createTextNode(toString(i));
	const user = document.createTextNode(allScores[i].username);
    const moves = document.createTextNode(allScores[i].moves);
    const time = document.createTextNode(toString(allScores[i].minutes) + toString(allScores[i].seconds));

	cell1.appendChild(rank);
	cell2.appendChild(user);
	cell3.appendChild(moves);
	cell4.appendChild(time);

	return new_row
}