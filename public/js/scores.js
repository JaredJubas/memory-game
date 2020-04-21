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
    
    const cell1 = document.createTextNode(toString(i));
    const cell2 = document.createTextNode(allScores[i].username);
    const cell3 = document.createTextNode(allScores[i].moves);
    const cell4 = document.createTextNode(toString(allScores[i].minutes) + toString(allScores[i].seconds));

	new_row.appendChild(cell1);
	new_row.appendChild(cell2);
    new_row.appendChild(cell3);
    new_row.appendChild(cell4);

	return new_row
}