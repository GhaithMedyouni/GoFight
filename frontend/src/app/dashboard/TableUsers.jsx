'use client'
import { deleteAthlete } from '../../services/athletesService'

export default function TableUsers({ data, onDeleted, onEdit }) {
  return (
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
          {data.map((u) => (
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
                <button
                  onClick={() => onEdit(u)}
                  className="text-yellow-400 hover:text-yellow-200 font-semibold mr-3"
                  title="Modifier"
                >
                  ✏️
                </button>
                <button
                  onClick={() =>
                    deleteAthlete(u._id).then(onDeleted).catch(console.error)
                  }
                  className="text-red-500 hover:text-red-300 font-semibold"
                  title="Supprimer"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td
                colSpan="7"
                className="text-center text-gray-400 py-6 italic"
              >
                Aucun athlète trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
