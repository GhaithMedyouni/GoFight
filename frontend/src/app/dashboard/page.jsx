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

  const load = async () => {
    const data = await fetchAthletes()
    setAthletes(data)
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

  return (
    <div className="p-6 space-y-6 text-white bg-[#0B0B0B] min-h-screen">
      {/* ---- CARTES STATS ---- */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg text-center shadow">
          <h3 className="text-yellow-400 text-lg font-semibold">Total</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg text-center">
          <h3 className="text-yellow-400 text-lg font-semibold">KickBoxing</h3>
          <p className="text-2xl font-bold">{stats.kick}</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg text-center">
          <h3 className="text-yellow-400 text-lg font-semibold">Boxing Anglaise</h3>
          <p className="text-2xl font-bold">{stats.box}</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg text-center">
          <h3 className="text-yellow-400 text-lg font-semibold">Crossfit</h3>
          <p className="text-2xl font-bold">{stats.cross}</p>
        </div>
      </div>

      {/* ---- BARRE DE RECHERCHE ---- */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Rechercher un athlète..."
          className="bg-[#111] border border-yellow-500/30 rounded-lg px-4 py-2 w-1/2 text-yellow-100 focus:ring-2 focus:ring-yellow-400"
        />
        <button
          onClick={() => setEditing('add')}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg transition"
        >
          ➕ Ajouter Athlète
        </button>
      </div>

      {/* ---- TABLEAU ---- */}
      <TableUsers 
        data={filtered} 
        onDeleted={load} 
        onEdit={setEditing}
        onEditFiche={setEditingFiche}
      />

      {/* ---- FORMULAIRE AJOUT ---- */}
      {editing === 'add' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <AddUserForm onAdded={() => { load(); setEditing(null); }} />
        </div>
      )}

      {/* ---- FORMULAIRE UPDATE INFO DE BASE ---- */}
      {editing && editing !== 'add' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <UpdateUserForm user={editing} onUpdated={() => { load(); setEditing(null); }} />
        </div>
      )}

      {/* ---- FORMULAIRE FICHE TECHNIQUE ---- */}
      {editingFiche && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-y-auto">
          <FormulaireFicheTechnique 
            athlete={editingFiche} 
            onSaved={() => { load(); setEditingFiche(null); }} 
          />
        </div>
      )}
    </div>
  )
}