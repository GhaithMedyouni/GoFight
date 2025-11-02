'use client';

import { useEffect, useState, useMemo } from 'react';
import { fetchAthletes } from '../../services/athletesService';
import UpdateUserForm from '../dashboard/UpdateUserForm';
import FormulaireFicheTechnique from '../dashboard/FormulaireFicheTechnique';
import TableUsers from '../dashboard/TableUsers';

export default function CrossfitPage() {
  const [athletes, setAthletes] = useState([]);
  const [search, setSearch] = useState('');
  const [ageCategory, setAgeCategory] = useState(''); // 🔹 Ajout du filtre catégorie d’âge
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editingFiche, setEditingFiche] = useState(null);

  // 🧮 Calcul de l’âge d’un athlète
  const calculateAge = (dateNaissance) => {
    if (!dateNaissance) return 0;
    const diff = Date.now() - new Date(dateNaissance).getTime();
    return Math.floor(diff / 31557600000);
  };

  // 🎯 Détermination de la catégorie d’âge
  const getCategorieAge = (age) => {
    if (age <= 6) return 'Pré-poussin';
    if (age <= 9) return 'Poussin';
    if (age <= 12) return 'École';
    if (age <= 13) return 'Minimes';
    if (age <= 15) return 'Cadet';
    if (age <= 18) return 'Junior';
    return 'Senior';
  };

  // 🔁 Chargement des athlètes Crossfit
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAthletes('Crossfit');
      setAthletes(data);
    } catch (err) {
      console.error('Erreur chargement Crossfit:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔍 Filtrage combiné (nom + catégorie d’âge)
  const filtered = useMemo(() => {
    return athletes.filter((a) => {
      const fullName = `${a.nom} ${a.prenom}`.toLowerCase();
      const age = calculateAge(a.dateNaissance);
      const categorie = getCategorieAge(age);
      const matchesSearch = fullName.includes(search.toLowerCase());
      const matchesCategory = !ageCategory || categorie === ageCategory;
      return matchesSearch && matchesCategory;
    });
  }, [athletes, search, ageCategory]);

  const totalFiltered = filtered.length;

  return (
    <div className="p-6 space-y-6 text-white bg-[#0B0B0B] min-h-screen mt-20">
      {/* ---- HEADER ---- */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-yellow-400 flex items-center gap-3">
          🏋️ Crossfit
        </h1>
        <div className="text-gray-400 text-sm">
          {totalFiltered} athlète{totalFiltered > 1 ? 's' : ''}
        </div>
      </div>

      {/* ---- BARRE DE RECHERCHE + FILTRAGE ---- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* 🔍 Recherche */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Rechercher un athlète Crossfit..."
          className="bg-[#111] border border-yellow-500/30 rounded-lg px-4 py-2 w-full sm:w-1/2 text-yellow-100 focus:ring-2 focus:ring-yellow-400"
        />

        {/* 🧩 Sélecteur de catégorie d’âge */}
        <select
          value={ageCategory}
          onChange={(e) => setAgeCategory(e.target.value)}
          className="bg-[#111] border border-yellow-500/30 rounded-lg px-4 py-2 text-yellow-100 focus:ring-2 focus:ring-yellow-400"
        >
          <option value="">🧒 Toutes les catégories</option>
          <option value="Pré-poussin">Pré-poussin</option>
          <option value="Poussin">Poussin</option>
          <option value="École">École</option>
          <option value="Minimes">Minimes</option>
          <option value="Cadet">Cadet</option>
          <option value="Junior">Junior</option>
          <option value="Senior">Senior</option>
        </select>
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
            {search || ageCategory
              ? '🔍 Aucun athlète trouvé avec ce filtre'
              : '📭 Aucun athlète Crossfit'}
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
