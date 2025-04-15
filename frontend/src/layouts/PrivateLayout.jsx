import Sidebar from "../components/Sidebar";

function PrivateLayout({ children }) {
  return (

  <div className="ml-64">
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  </div>
  );
}

export default PrivateLayout;


  



