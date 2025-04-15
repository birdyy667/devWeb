import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";

function LandingPage() {
    const location = useLocation();
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('open') === 'login') {
          setShowLoginModal(true);
        }
      }, [location]);

  return (
    <div className="font-sans">
      {/* ===== HERO AVEC VIDÉO ===== */}
      <section className="relative h-screen overflow-hidden text-white">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/logos/3F_Global_video.mov" type="video/mp4" />
          Votre navigateur ne prend pas en charge la lecture vidéo.
        </video>

        <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />

        <div className="relative z-20 h-full flex flex-col justify-between">
          {/* ===== NAVBAR ===== */}
          <header className="flex items-center justify-between px-10 py-6">
            <div className="flex items-center space-x-2">
              <div className="bg-white text-blue-600 font-bold w-8 h-8 rounded flex items-center justify-center">A</div>
              <span className="text-lg font-semibold text-white">Accessly</span>
            </div>

            <nav className="hidden md:flex gap-10 absolute left-1/2 transform -translate-x-1/2 text-sm font-medium text-white">
              <a href="#boutiques" className="hover:underline">BOUTIQUES</a>
              <a href="#restaurants" className="hover:underline">RESTAURANTS</a>
              <a href="#evenements" className="hover:underline">ÉVÉNEMENTS</a>
              <a href="#offres" className="hover:underline">OFFRES</a>
              <a href="#visite" className="hover:underline">VISITE</a>
            </nav>

            <div className="flex gap-4 text-sm">
              <button
                onClick={() => setShowRegisterModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
              >
                Commencer
              </button>
            </div>
          </header>

          {/* ===== TITRE HERO ===== */}
          <main className="flex flex-col justify-center items-center text-center flex-1 px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Bienvenue dans votre centre commercial</h1>
            <p className="text-lg md:text-xl max-w-xl text-white">
              Trouvez vos marques préférées, explorez les offres et ne manquez aucun événement.
            </p>
          </main>
        </div>
      </section>

      {/* ===== SECTION NOS BOUTIQUES (placée avant Quoi de neuf) ===== */}
      <section id="boutiques" className="bg-white text-center text-gray-800 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Nos Boutiques</h2>
          <p className="text-gray-600 mb-10">
            Avec plus de 200 boutiques, restaurants, et services, nous vous offront une multitude de choix.
          </p>
        </div>
      </section>

      {/* ===== LOGOS ENTRE LES DEUX SECTIONS ===== */}
      <section className="bg-white py-8 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee space-x-20 flex items-center">
          {["nike", "zara", "sephora", "pullbear", "chanel", "adidas"].map((logo, i) => (
            <img
              key={i}
              src={`/logos/${logo}.png`}
              alt={logo}
              className="inline-block h-16 mx-8 object-contain opacity-80 hover:opacity-100 transition"
            />
          ))}
          {["nike", "zara", "sephora", "pullbear", "chanel", "adidas"].map((logo, i) => (
            <img
              key={`bis-${i}`}
              src={`/logos/${logo}.png`}
              alt={logo}
              className="inline-block h-16 mx-8 object-contain opacity-80 hover:opacity-100 transition"
            />
          ))}
        </div>
      </section>

      {/* ===== SECTION QUOI DE NEUF ===== */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10"> Quoi de neuf ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
              <img src="/logos/maisondumonde.jpeg" alt="Maison du Monde" className="w-full h-48 object-cover" />
              <div className="p-5">
                <h3 className="font-bold text-gray-800 mb-2">Ouverture : Maison du Monde</h3>
                <p className="text-sm text-gray-600 mb-2">🧭 Niveau 1, face à Zara</p>
                <p className="text-sm text-gray-600">Un nouveau concept store déco vous attend dès ce samedi.</p>
                <p className="mt-3 font-semibold text-blue-600 text-sm hover:underline">EN SAVOIR PLUS ➤</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
              <img src="/logos/animatioenfant.jpeg" alt="Animation enfants" className="w-full h-48 object-cover" />
              <div className="p-5">
                <h3 className="font-bold text-gray-800 mb-2">🎠 Animation enfants ce week-end</h3>
                <p className="text-sm text-gray-600 mb-2">📍 Place de l’Agora</p>
                <p className="text-sm text-gray-600">Spectacles et ateliers gratuits pour les 3-12 ans, samedi et dimanche.</p>
                <p className="mt-3 font-semibold text-blue-600 text-sm hover:underline">EN SAVOIR PLUS ➤</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
              <img src="/logos/soldes.jpeg" alt="Soldes" className="w-full h-48 object-cover" />
              <div className="p-5">
                <h3 className="font-bold text-gray-800 mb-2">🛍️ Ventes privées jusqu'à -50%</h3>
                <p className="text-sm text-gray-600 mb-2">🔒 Réservé aux membres Accessly</p>
                <p className="text-sm text-gray-600">Profitez d'offres exclusives dans vos boutiques préférées !</p>
                <p className="mt-3 font-semibold text-blue-600 text-sm hover:underline">EN SAVOIR PLUS ➤</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POPUP MODALE INSCRIPTION ===== */}
      {showRegisterModal && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    onClick={() => setShowRegisterModal(false)} // ferme en cliquant autour
  >
    <div
      className="bg-white rounded-lg w-full max-w-md p-6 relative"
      onClick={(e) => e.stopPropagation()} // bloque le clic sur le formulaire
    >
      <Register onSuccess={() => {
        setShowRegisterModal(false);
        setShowLoginModal(true);
      }} 
        onSwitch={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
        }}
      />
    </div>
  </div>
)}

{showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setShowLoginModal(false)}>
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
            <Login
              onSuccess={() => {
                setShowLoginModal(false);
                window.location.href = "/dashboard";
              }}
              onSwitch={() => {
                setShowLoginModal(false);
                setShowRegisterModal(true);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
