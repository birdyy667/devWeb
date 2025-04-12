import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Objet() {
	const [obj, setObj] = useState(null);
	const [message, setMessage] = useState('');
	const [formData, setFormData] = useState({});
	const navigate = useNavigate();
	const objId = localStorage.getItem('objId');

	useEffect(() => {
		
		fetch(`http://localhost:3001/api/objet/${objId}`)
		.then((res) => res.json())
		.then(
			(data) => {
				setObj(data);
				setFormData({
					nom: data.nom,
					outils: data.outils,
				});
			}
		)
		.catch(() => setMessage("Erreur lors du chargement de l'objet connecté."));
	}, [objId]);

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		setFormData({ ...formData, [name]: files ? files[0] : value });
	};

	if (!obj) {
		return (
			<div className="flex justify-center items-center h-screen">
				<p className="text-gray-700 text-xl">Chargement de l'objet connecté...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 p-6 flex justify-center">
			<div className="bg-white w-full max-w-5xl shadow-lg rounded-xl flex">

				{/* Main content */}
				<main className="flex-1 p-8">
					<h2 className="text-2xl font-bold mb-6 text-gray-800">Objet connecté</h2>

					{
						message && (
							<p className="mb-4 text-green-600 font-medium">{message}</p>
						)
					}
					
					
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm text-gray-600 font-medium">Nom</label>
							<p className="w-full mt-1 px-3 py-2 border rounded bg-gray-100">
								{obj.nom}
							</p>
						</div>
						<div>
							<label className="block text-sm text-gray-600 font-medium">Outils</label>
							<p className="w-full mt-1 px-3 py-2 border rounded bg-gray-100">
								{obj.outils}
							</p>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

export default Objet;
