'use client'
import { useState } from 'react'
import { createAthlete } from '../../services/athletesService'
import Image from 'next/image'
import { XCircle, Upload } from 'lucide-react'

export default function AddUserForm({ onAdded }) {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    dateNaissance: '',
    numTel: '',
    specialite: 'KickBoxing',
    photo: '',
  })

  const [preview, setPreview] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPreview(ev.target.result)
        setForm({ ...form, photo: ev.target.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await createAthlete(form)
    onAdded()
  }

  return (
    <div className="bg-[#0B0B0B]/95 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-8 shadow-[0_0_25px_rgba(255,214,10,0.4)] w-[500px] relative">
      {/* === Header === */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-yellow-400 text-2xl font-extrabold tracking-wide">➕ Ajouter un Athlète</h2>
        <button
          onClick={onAdded}
          className="text-gray-400 hover:text-yellow-400 transition"
          title="Annuler"
        >
          <XCircle size={28} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-white">
        {/* === Photo Upload === */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-yellow-400 flex items-center justify-center mb-3">
            {preview ? (
              <Image src={preview} alt="Preview" width={128} height={128} className="object-cover" />
            ) : (
              <Upload size={40} className="text-yellow-400" />
            )}
          </div>
          <label
            htmlFor="photoUpload"
            className="cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1 rounded-md font-semibold transition-all"
          >
            Importer une photo
          </label>
          <input
            id="photoUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* === Inputs === */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input
            name="nom"
            value={form.nom}
            onChange={handleChange}
            placeholder="Nom"
            className="input bg-[#111] border border-yellow-500/40 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
          <input
            name="prenom"
            value={form.prenom}
            onChange={handleChange}
            placeholder="Prénom"
            className="input bg-[#111] border border-yellow-500/40 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
          <input
            type="date"
            name="dateNaissance"
            value={form.dateNaissance}
            onChange={handleChange}
            className="bg-[#111] border border-yellow-500/40 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
          <input
            name="numTel"
            value={form.numTel}
            onChange={handleChange}
            placeholder="Numéro (optionnel)"
            className="bg-[#111] border border-yellow-500/40 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
          <select
            name="specialite"
            value={form.specialite}
            onChange={handleChange}
            className="col-span-2 bg-[#111] border border-yellow-500/40 text-yellow-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          >
            <option>KickBoxing</option>
            <option>Boxing Anglaise</option>
            <option>Crossfit</option>
          </select>
        </div>

        {/* === Buttons === */}
        <div className="flex justify-between gap-4 mt-6">
          <button
            type="submit"
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded-lg shadow-[0_0_15px_rgba(255,214,10,0.5)] transition-all"
          >
            Ajouter
          </button>
          <button
            type="button"
            onClick={onAdded}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-all"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}
