'use client'
import { useEffect, useState } from 'react'
import { fetchAthletes } from '../../services/athletesService'
import AddUserForm from './AddUserForm'
import UpdateUserForm from './UpdateUserForm'
import FormulaireFicheTechnique from './FormulaireFicheTechnique'
import TableUsers from './TableUsers'

export default function DashboardPage() {
  const [athletes, setAthletes] = useState([])
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [editingFiche, setEditingFiche] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchAthletes()
      setAthletes(data)
    } catch (err) {
      console.error('Erreur chargement athlètes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = athletes.filter((a) =>
    `${a.nom} ${a.prenom}`.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: athletes.length,
    kick: athletes.filter(a => a.specialite === 'KickBoxing').length,
    box: athletes.filter(a => a.specialite === 'Boxing Anglaise').length,
    cross: athletes.filter(a => a.specialite === 'Crossfit').length,
  }

  const statsCards = [
    { title: 'Total', value: stats.total, icon: '📊' },
    { title: 'KickBoxing', value: stats.kick, icon: '🥋' },
    { title: 'Boxing Anglaise', value: stats.box, icon: '🥊' },
    { title: 'Crossfit', value: stats.cross, icon: '💪' },
  ]

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white pt-20 px-6 pb-6 md:pt-24">


      {/* ---- HEADER ---- */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-yellow-400 mb-6 md:mb-8 drop-shadow-[0_0_10px_rgba(255,214,10,0.6)]">
        📊 Tableau de bord
      </h1>

      {/* ---- CARTES STATS ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 md:mb-8">
        {statsCards.map((stat, index) => (
          <div 
            key={index}
            className="bg-yellow-500/10 border border-yellow-500/30 p-5 md:p-6 rounded-lg text-center 
              shadow-[0_0_20px_rgba(255,214,10,0.3)] hover:shadow-[0_0_25px_rgba(255,214,10,0.5)] 
              transition-all duration-300"
          >
            <h3 className="text-yellow-400 text-base md:text-lg font-semibold mb-2 flex items-center justify-center gap-2">
              <span>{stat.icon}</span>
              <span className="truncate">{stat.title}</span>
            </h3>
            <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ---- BARRE DE RECHERCHE + BOUTON AJOUTER ---- */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Rechercher un athlète..."
          className="bg-[#111] border border-yellow-500/30 rounded-lg px-4 py-3 
            w-full sm:w-1/2 text-yellow-100 
            focus:ring-2 focus:ring-yellow-400 focus:outline-none 
            transition-all duration-200 placeholder:text-gray-500"
        />
        <button
          onClick={() => setEditing('add')}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold 
            px-5 py-3 rounded-lg transition-all duration-200 
            shadow-[0_0_15px_rgba(255,214,10,0.3)] hover:shadow-[0_0_20px_rgba(255,214,10,0.5)]
            whitespace-nowrap"
        >
          ➕ Ajouter Athlète
        </button>
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
            {search ? '🔍 Aucun athlète trouvé' : '📭 Aucun athlète enregistré'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <TableUsers 
            data={filtered} 
            onDeleted={load} 
            onEdit={setEditing}
            onEditFiche={setEditingFiche}
          />
        </div>
      )}

      {/* ---- FORMULAIRE AJOUT ---- */}
      {editing === 'add' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <AddUserForm onAdded={() => { load(); setEditing(null); }} />
          </div>
        </div>
      )}

      {/* ---- FORMULAIRE UPDATE INFO DE BASE ---- */}
      {editing && editing !== 'add' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <UpdateUserForm user={editing} onUpdated={() => { load(); setEditing(null); }} />
          </div>
        </div>
      )}

      {/* ---- FORMULAIRE FICHE TECHNIQUE ---- */}
      {editingFiche && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="w-full max-w-6xl">
            <FormulaireFicheTechnique 
              athlete={editingFiche} 
              onSaved={() => { load(); setEditingFiche(null); }} 
            />
          </div>
        </div>
      )}
    </div>
  )
}