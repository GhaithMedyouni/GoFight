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

  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const handleGeneratePDF = (athlete) => {
    try {
      generateFicheTechniquePDF(athlete);
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      alert('Erreur lors de la génération du PDF. Vérifiez les données.');
    }
  };

  return (
    <div className="space-y-6">
      {/* ---- TABLE (Desktop) ---- */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-[0_0_20px_rgba(255,214,10,0.15)] border border-yellow-500/20">
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
                  <div className="relative group w-10 h-10">
                    <img
                      src={u.photo || '/default-user.png'}
                      alt="athlete"
                      className="w-10 h-10 rounded-full object-cover border border-yellow-500/30 
                 transition-transform duration-300 group-hover:scale-150 
                 group-hover:z-10 group-hover:shadow-[0_0_10px_rgba(255,214,10,0.8)]"
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
                    <button
                      onClick={() => onEdit(u)}
                      className="text-yellow-400 hover:text-yellow-200 transition"
                      title="Modifier info de base"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => onEditFiche(u)}
                      className="text-blue-400 hover:text-blue-300 transition"
                      title="Compléter fiche technique"
                    >
                      <FileText size={18} />
                    </button>

                    <button
                      onClick={() => handleGeneratePDF(u)}
                      className="text-green-400 hover:text-green-300 transition"
                      title="Générer PDF"
                    >
                      <Download size={18} />
                    </button>

                    <button
                      onClick={() =>
                        deleteAthlete(u._id).then(onDeleted).catch(console.error)
                      }
                      className="text-red-500 hover:text-red-300 transition"
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

      {/* ---- MOBILE CARD VIEW ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {paginatedData.map((u) => (
          <div
            key={u._id}
            className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 
              shadow-[0_0_15px_rgba(255,214,10,0.15)] hover:shadow-[0_0_25px_rgba(255,214,10,0.3)] 
              transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-3">
              <img
                src={u.photo || '/default-user.png'}
                alt={u.nom}
                className="w-14 h-14 rounded-full object-cover border border-yellow-500/30"
              />
              <div>
                <h3 className="text-yellow-400 font-semibold text-lg">
                  {u.nom} {u.prenom}
                </h3>
                <p className="text-sm text-gray-400">{u.specialite}</p>
              </div>
            </div>

            <div className="text-sm space-y-1 text-gray-300 mb-3">
              <p><span className="text-yellow-400">📅</span> {u.dateNaissance || '-'}</p>
              <p><span className="text-yellow-400">📞</span> {u.numTel || '-'}</p>
            </div>

            <div className="flex justify-between items-center text-sm">
              <button
                onClick={() => onEdit(u)}
                className="text-yellow-400 hover:text-yellow-200 transition"
              >
                ✏️ Modifier
              </button>
              <button
                onClick={() => onEditFiche(u)}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <FileText size={16} /> Fiche
              </button>
              <button
                onClick={() => handleGeneratePDF(u)}
                className="text-green-400 hover:text-green-300 flex items-center gap-1"
              >
                <Download size={16} /> PDF
              </button>
              <button
                onClick={() =>
                  deleteAthlete(u._id).then(onDeleted).catch(console.error)
                }
                className="text-red-500 hover:text-red-300"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ---- PAGINATION ---- */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 transition ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
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
            className={`px-4 py-2 rounded-lg border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 transition ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            Suivant ➡️
          </button>
        </div>
      )}
    </div>
  );
}
