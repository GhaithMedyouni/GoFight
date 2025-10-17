'use client'

import { useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // ✅ URL API dynamique (dev + prod)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      })

      // ✅ Nom cohérent avec ton backend : "access_token"
      Cookies.set('token', res.data.access_token, { expires: 1 })
      router.push('/dashboard')
    } catch (err) {
      console.error('Erreur login:', err)
      setError('Identifiants invalides ou serveur injoignable')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      {/* 🌟 Dégradé de fond jaune + noir */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B0B] via-[#1a1a00] to-[#FFD60A] opacity-40 animate-pulse"></div>

      {/* Halo jaune */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-yellow-500 rounded-full blur-[180px] opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-400 rounded-full blur-[200px] opacity-20"></div>

      {/* Contenu */}
      <div className="relative z-10 bg-[#111111]/90 backdrop-blur-sm rounded-2xl shadow-[0_0_25px_rgba(255,214,10,0.4)] p-8 w-full max-w-md border border-yellow-500/30">
        <div className="flex flex-col items-center justify-center mb-6">
          <Image
            src="/GoFight.png"
            alt="GoFight Logo"
            width={80}
            height={80}
            className="mb-2"
            priority
          />
          <h1 className="text-3xl font-extrabold text-yellow-400 tracking-wide">
            GoFight Admin
          </h1>
        </div>

        <p className="text-gray-400 text-center mb-8">
          Connectez-vous à votre espace d’administration
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nom d’utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-yellow-500/50 bg-transparent text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
              placeholder="Votre nom d’utilisateur"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-yellow-500/50 bg-transparent text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
              placeholder="Votre mot de passe"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-center text-sm font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg shadow-[0_0_15px_rgba(255,214,10,0.5)] transition-all duration-200"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-gray-500 text-center text-sm mt-6">
          © {new Date().getFullYear()} GoFight. Tous droits réservés.
        </p>
      </div>
    </div>
  )
}
