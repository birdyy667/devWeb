import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001'); // backend URL

function Recherche() {
	const navigate = useNavigate();
	const [input, setInput] = useState('');
	const [result, setResult] = useState(null);

	useEffect(
		() => {
			socket.on(
				'response', (data) => {
					console.log('Server says:', data);
				}
			);
		}
	, []);

	useEffect(
		() => {
			const delayDebounce = setTimeout(
				() => {
					if (input.trim()) {
					fetch(`http://localhost:3001/api/recherche/check?query=${input}`)
						.then(res => res.json())
						.then(data => setResult(data));
					}
					else {
						setResult(null);
					}
				}
			, 300);		// debounce input (300ms delay)
			return () => clearTimeout(delayDebounce);
		}
	, [input]);

	const handleSubmit = (id) => {
		navigate(`/objet/${id}`);
	};

	const handleChange = (e) => {
		const value = e.target.value;
		setInput(value);
		socket.emit('userInput', value);
		/*
		var test = 0;
		var i = 0;
		var found = document.createElement("div");
		found.onClick={handleSubmit};
		found.className="w-half px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
		for (i in text){
			if (test == 0){
				found.innerHTML = "";
			}
			if (textarea.value.length > 2 && text[i].toLowerCase().includes(textarea.value.toLowerCase())){
				if (test == 0){
					link.innerHTML = "";
				}
				test = 1;
				link.innerHTML += text[i] + "<br>";
				sugg.appendChild(link);
			}
		}
		
		
		
		try {
			const res = fetch('http://localhost:3001/api/recherche', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});
			
			console.log(res);
			const data = res;
			
			if (res.ok) {
				setMessage(`🎉 Bienvenue, ${data.objetConnecte.nom} !`);
				localStorage.setItem('objId', data.objetConnecte.idObjetConnecte);
			}
			else {
				setMessage(`❌ Erreur : ${data.error}`);
			}
			
		}
		catch (err) {
			console.error('Erreur côté client :', err);
			setMessage('Erreur de connexion au serveur');
		}
		*/
	};

	return (
		<div className="min-h-screen bg-gradient-to-r from-blue-400 to-blue-700 flex justify-center">
			<div className="bg-white p-8 rounded-1xl shadow-lg w-full max-w-md">

				<h2 className="text-2xl font-semibold mb-6 text-center">Recherche</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<input
						name="nom"
						type="text"
						placeholder="Rechercher"
						onChange={handleChange}
						className="w-half px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				{
					result && (
						<p className="mt-4 text-center text-sm text-red-600">
							{result}
						</p>
					)
				}
			</div>
			<div className="bg-white p-8 rounded-1xl shadow-lg w-full max-w">
				{result && result.length > 0 && (
					<div>
						{result.map(
							item =>(
								<>
									<p
										className="w-half px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										{item.nom}
									</p>
									<p
										className="w-half px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
									{item.outils}
									</p>
									<button
										type="submit"
										onClick={() => navigate('/objet')}
										className="w-max bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
									>
										Voir l'objet
									</button>
								</>
							)
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default Recherche;
