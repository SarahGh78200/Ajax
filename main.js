import './style.css';

const divBattles = document.querySelector('#battles');
const formLogin = document.querySelector('#formLogin');
const formRegister = document.querySelector('#formRegister');
const emailRegisterInput = document.querySelector('#email-register');
const passwordRegisterInput = document.querySelector('#password-register');
const nameRegisterInput = document.querySelector('#name-register');
const passwordInput = document.querySelector('#password');
const emailInput = document.querySelector('#email');
const userDiv = document.querySelector('#user');

formLogin.addEventListener('submit', (event) => {
	event.preventDefault();
	const password = passwordInput.value;
	const email = emailInput.value;

	const options = {
		method: 'POST',
		body: JSON.stringify({ password, email }),
		headers: {
			'Content-Type': 'application/json',
		},
	};

	fetch(
		'https://api.which-one-battle.julienpoirier-webdev.com/api/auth/signin',
		options
	)
		.then((response) => {
			if (response.ok) {
				response.json().then((data) => {
					localStorage.setItem('token', data.token); // Le local storage est une zone de stockage dans le navigateur.
					//C'est une API intégrée a JS (comme le DOM)
					userDiv.innerHTML = `<p>Bonjour ${data.user.name} !!</p>`;
					formLogin.classList.add('hidden');
					formRegister.classList.add('hidden');
				});
			} else {
				alert('Il y a une erreur avec votre login / mdp');
			}
		})
		.catch((error) => {
			console.log(error);
		});
});

const headers = localStorage.getItem('token')
	? { Authorization: `Bearer ${localStorage.getItem('token')}` }
	: {};

fetch('https://api.which-one-battle.julienpoirier-webdev.com/api/battles', {
	headers: headers,
})
	.then(function (response) {
		if (response.ok) {
			return response
				.json()
				.then(function (data) {
					data.forEach(function (battle) {
						const oneBattleDiv = document.createElement('div');
						oneBattleDiv.classList.add('battle');

						const question = document.createElement('p');
						question.innerText = battle.question;
						const texte = document.createElement('p');
						texte.innerText = battle.texte;

						oneBattleDiv.appendChild(question);
						oneBattleDiv.appendChild(texte);

						let propositions = document.createElement('div');
						battle.propositions.forEach(function (proposition) {
							const div = document.createElement('div');
							div.innerHTML = `<span>${proposition.name}</span><span>${proposition.value}</span>`;
							const button = document.createElement('button');
							button.innerText = `Voter pour ${proposition.name}`;
							button.addEventListener('click', () => {
								// faire une requête AJAX qui envoi vers
								// https://api.which-one-battle.julienpoirier-webdev.com/api/battles/:idBattle/vote
								// ajouter des options avec le token JWT
								console.log(`je vote pour ${proposition.name}`);
							});
							div.appendChild(button);
							propositions.appendChild(div);
						});
						oneBattleDiv.appendChild(propositions);

						divBattles.appendChild(oneBattleDiv);
					});
				})
				.catch(function (error) {
					console.log(error);
				});
		} else {
			throw new Error('Erreur : Problème avec la requête');
		}
	})
	.catch(function (error) {
		console.log(error);
	});

const localToken = localStorage.getItem('token');

if (localToken) {
	formLogin.classList.toggle('hidden');
	formRegister.classList.toggle('hidden');
}

formRegister.addEventListener('submit', (event) => {
	event.preventDefault();
	const password = passwordRegisterInput.value;
	const email = emailRegisterInput.value;
	const name = nameRegisterInput.value;

	const options = {
		method: 'POST',
		body: JSON.stringify({ password, email, name }),
		headers: {
			'Content-Type': 'application/json',
		},
	};

	fetch(
		'https://api.which-one-battle.julienpoirier-webdev.com/api/users',
		options
	)
		.then((response) => {
			if (response.ok) {
				response.json().then((data) => {
					console.log(data);
					localStorage.setItem('token', data.token);
					userDiv.innerHTML = `<p>Bonjour ${data.user.name} !!</p>`;
					formRegister.classList.add('hidden');
					formLogin.classList.add('hidden');
				});
			} else {
				alert('Il y a une erreur avec votre inscription');
			}
		})
		.catch((error) => {
			console.log(error);
		});
});
