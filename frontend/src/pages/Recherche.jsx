import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:3001'); // backend URL

function Recherche() {
	const navigate = useNavigate();
	const [input, setInput] = useState('');
	const [result, setResult] = useState(null);

	/*
	useEffect(
		() => {
			socket.on(
				'response', (data) => {
					console.log('Server says:', data);
				}
			);
		}
	, []);
	*/

	useEffect(
		() => {
			const delayDebounce = setTimeout(
				() => {
					if (input.trim()) {
						fetch(`http://localhost:3001/api/recherche/recherche?query=${input}`)
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

	const handleSubmit = async (e, item) => {
		e.preventDefault();
	
		try {
		  const res = await fetch('http://localhost:3001/api/recherche/findObject', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({idObjet : item.idObjetConnecte})
		  });
	
		  const data = await res.json();
	
		  if (res.ok) {
			localStorage.setItem('objId', data.objet.id);
			navigate('/objet');
		  } 
		} catch (err) {
		  console.error('Erreur côté client :', err);
		}
	};

	const handleChange = (e) => {
		const value = e.target.value;
		setInput(value);
		//socket.emit('userInput', value);
	};

	return (
		<div className="min-h-screen bg-gradient-to-r from-blue-400 to-blue-700 flex justify-center">
			<div className="bg-white p-8 rounded-1xl shadow-lg w-full max-w-md">

				<h2 className="text-2xl font-semibold mb-6 text-center">Recherche</h2>
				<div >
					<input
						name="nom"
						type="text"
						placeholder="Rechercher"
						onChange={handleChange}
						className="w-max px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>
			<div className="bg-white p-8 rounded-1xl shadow-lg w-full max-w">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<p className="w-full mt-1 px-3 py-2">Nom</p>
					</div>
					<div>
						<p className="w-full mt-1 px-3 py-2">Outils</p>
					</div>
					<div>
						<p className="w-full mt-1 px-3 py-2">Id</p>
					</div>
				</div>
				
				{result && result.length > 0 && (
					<div>
						{result.map(
							item =>(
								<><form onSubmit={(e) => handleSubmit(e, item)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<input
								  name="nom"
								  type="text"
								  value={item.nom}
								  readOnly
								  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<input
								  name="outils"
								  type="text"
								  value={item.outils}
								  readOnly
								  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<input
								  name="nom"
								  type="text"
								  value={item.idObjetConnecte}
								  readOnly
								  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<button
									type="submit"
									className="w-max bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
								>
									Voir l'objet
								</button>
							  </form>
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
