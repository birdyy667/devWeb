import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:3001'); // backend URL

function Recherche() {
	const navigate = useNavigate();
	const [input, setInput] = useState('');
	const [result, setResult] = useState(null);
	const [formData, setFormData] = useState({
		nom: '',
		outils: ''
	  });

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

	const handleSubmit = async (e) => {
		e.preventDefault();
	
		try {
		  const res = await fetch('http://localhost:3001/api/findObject', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(formData)
		  });
	
		  const data = await res.json();
	
		  if (res.ok) {
			localStorage.setItem('userId', data.objet.idObjetConnecte);
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


	const handleLoad = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
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
				
				{result && result.length > 0 && (
					<div>
						{result.map(
							item =>(
								<><form onSubmit={handleSubmit} className="space-y-4">
								<input
								  name="nom"
								  type="text"
								  placeholder={item.nom}
								  onChange={handleLoad}
								  disabled
								  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<input
								  name="outils"
								  type="text"
								  placeholder={item.outils}
								  onChange={handleLoad}
								  disabled
								  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<button
									type="submit"
									onClick={handleSubmit}
									className="w-max bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
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
