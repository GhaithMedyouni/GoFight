'use client';
import { useState, useMemo } from 'react';
import { deleteAthlete } from '../../services/athletesService';
import { generateFicheTechniquePDF } from './generateFicheTechniquePDF ';
import { FileText, Download } from 'lucide-react';

export default function TableUsers({ data, onDeleted, onEdit, onEditFiche }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }, [data, currentPage]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleGeneratePDF = (athlete) => {
    try {
      generateFicheTechniquePDF(athlete);
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      alert('Erreur lors de la génération du PDF. Assurez-vous que toutes les données sont complètes.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Tableau principal */}
      <div className="overflow-x-auto rounded-lg shadow-[0_0_20px_rgba(255,214,10,0.15)] border border-yellow-500/20">
        <table className="w-full text-gray-300">
          <thead className="bg-yellow-500/10 text-yellow-400 uppercase text-sm">
            <tr>
              <th className="p-3 text-left">Photo</th>
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">Prénom</th>
              <th className="p-3 text-left">Date de naissance</th>
              <th className="p-3 text-left">Téléphone</th>
              <th className="p-3 text-left">Spécialité</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((u) => (
              <tr
                key={u._id}
                className="border-b border-yellow-500/10 hover:bg-yellow-500/5 transition"
              >
                <td className="p-3">
                  <div className="relative w-10 h-10 group">
                    <img
                      src={u.photo || '/default-user.png'}
                      alt="athlete"
                      className="w-10 h-10 rounded-full object-cover border border-yellow-500/30 transform transition-transform duration-300 ease-out group-hover:scale-100 group-hover:z-10"
                    />
                  </div>
                </td>
                <td className="p-3">{u.nom}</td>
                <td className="p-3">{u.prenom}</td>
                <td className="p-3">{u.dateNaissance || '-'}</td>
                <td className="p-3">{u.numTel || '-'}</td>
                <td className="p-3">{u.specialite}</td>

                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    {/* Bouton Modifier info de base */}
                    <button
                      onClick={() => onEdit(u)}
                      className="text-yellow-400 hover:text-yellow-200 font-semibold"
                      title="Modifier info de base"
                    >
                      ✏️
                    </button>

                    {/* Bouton Fiche Technique */}
                    <button
                      onClick={() => onEditFiche(u)}
                      className="text-blue-400 hover:text-blue-300"
                      title="Compléter fiche technique"
                    >
                      <FileText size={18} />
                    </button>

                    {/* Bouton Générer PDF */}
                    <button
                      onClick={() => handleGeneratePDF(u)}
                      className="text-green-400 hover:text-green-300"
                      title="Générer PDF"
                    >
                      <Download size={18} />
                    </button>

                    {/* Bouton Supprimer */}
                    <button
                      onClick={() =>
                        deleteAthlete(u._id).then(onDeleted).catch(console.error)
                      }
                      className="text-red-500 hover:text-red-300 font-semibold"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-gray-400 py-6 italic">
                  Aucun athlète trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 transition ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            ⬅️ Précédent
          </button>

          <span className="text-gray-400 text-sm">
            Page <span className="text-yellow-400">{currentPage}</span> sur{' '}
            <span className="text-yellow-400">{totalPages}</span>
          </span>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 transition ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Suivant ➡️
          </button>
        </div>
      )}
    </div>
  );
}