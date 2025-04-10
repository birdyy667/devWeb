import AjoutObjets from '../components/AjoutObjets';
import ListeObjets from '../components/ListeObjets';
//import ModifObjets from '../components/ModifObjets';
import { useState } from 'react';

 function GestionObjets() {
   const [objects, setObjects] = useState([]);
   const [selectedObjectId, setSelectedObjectId] = useState(null);

   return (
     <div className="App">
       <h1>Gestion des Objets Connectés</h1>
       <AjoutObjets setObjects={setObjects} />
       <ListeObjets
         objects={objects}
         setObjects={setObjects}
         onEdit={setSelectedObjectId} // <-- passe une fonction pour sélectionner
       />
       {selectedObjectId && (
         <ModifObjets objectId={selectedObjectId} setObjects={setObjects} />
       )}
     </div>
   );
 }

 export default GestionObjets;
