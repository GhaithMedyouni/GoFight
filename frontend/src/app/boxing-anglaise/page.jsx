'use client';

import { useEffect, useState } from 'react';
import { fetchAthletes } from '../../services/athletesService';
import UpdateUserForm from '../dashboard/UpdateUserForm';
import FormulaireFicheTechnique from '../dashboard/FormulaireFicheTechnique';
import TableUsers from '../dashboard/TableUsers';

export default function BoxingPage() {
  const [athletes, setAthletes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editingFiche, setEditingFiche] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAthletes('Boxing Anglaise');
      setAthletes(data);
    } catch (err) {
      console.error('Erreur chargement Boxing Anglaise:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = athletes.filter((a) =>
    `${a.nom} ${a.prenom}`.toLowerCase().includes(search.toLowerCase())
  );



  return (
    <div className="p-6 space-y-6 text-white bg-[#0B0B0B] min-h-screen mt-20">
      {/* ---- HEADER ---- */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-yellow-400 flex items-center gap-3">
          🥊 Boxing Anglaise
        </h1>
        <div className="text-gray-400 text-sm">
          {athletes.length} athlète{athletes.length > 1 ? 's' : ''}
        </div>
      </div>

  

      {/* ---- BARRE DE RECHERCHE ---- */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Rechercher un athlète Boxing Anglaise..."
          className="bg-[#111] border border-yellow-500/30 rounded-lg px-4 py-2 w-full text-yellow-100 focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* ---- TABLEAU ---- */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Chargement des athlètes...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">
            {search ? '🔍 Aucun athlète trouvé' : '📭 Aucun athlète Boxing Anglaise'}
          </p>
        </div>
      ) : (
        <TableUsers
          data={filtered}
          onDeleted={loadData}
          onEdit={setEditing}
          onEditFiche={setEditingFiche}
        />
      )}

      {/* ---- FORMULAIRE UPDATE INFO DE BASE ---- */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <UpdateUserForm 
            user={editing} 
            onUpdated={() => { 
              loadData(); 
              setEditing(null); 
            }} 
          />
        </div>
      )}

      {/* ---- FORMULAIRE FICHE TECHNIQUE ---- */}
      {editingFiche && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-y-auto">
          <FormulaireFicheTechnique 
            athlete={editingFiche} 
            onSaved={() => { 
              loadData(); 
              setEditingFiche(null); 
            }} 
          />
        </div>
      )}
    </div>
  );
}