'use client'
import { useState } from 'react'
import { updateAthlete } from '../../services/athletesService'
import { XCircle, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

export default function FormulaireFicheTechnique({ athlete, onSaved }) {
  const [form, setForm] = useState({
    // Info Générale
    infoGenerale: athlete.infoGenerale || {},
    // Niveau Sportif
    niveauSportif: athlete.niveauSportif || {},
    // Profile Physique
    profilePhysique: athlete.profilePhysique || {},
    // Profile Technique
    profileTechnique: athlete.profileTechnique || {},
    // Données Biométriques
    donneesBiometriques: athlete.donneesBiometriques || {},
    // Profile Mental
    profileMental: athlete.profileMental || {},
    // Objectifs
    objectifs: athlete.objectifs || { objectifsList: [] },
    // Observations entraîneur
    observationsEntraineur: athlete.observationsEntraineur || [],
    // Commentaires parents (si moins de 14 ans)
    commentairesParents: athlete.commentairesParents || [],
    // Photos progression
    photosProgression: athlete.photosProgression || []
  })
  const [loading, setLoading] = useState(false) // <-- loader state
  const [saveMessage, setSaveMessage] = useState('') // Message de confirmation
  const [isObservationsOpen, setIsObservationsOpen] = useState(false)
  const [isCommentairesOpen, setIsCommentairesOpen] = useState(false)

  const age = athlete.dateNaissance
    ? Math.floor((new Date() - new Date(athlete.dateNaissance)) / 31557600000)
    : 0

  const getCategorieAge = (age) => {
    if (age <= 6) return 'Pre-poussin'
    if (age <= 9) return 'Poussin'
    if (age <= 12) return 'École'
    if (age <= 13) return 'Minimes'
    if (age <= 15) return 'Cadet'
    if (age <= 18) return 'Junior'
    return 'Senior'
  }

  const isBoxing = athlete.specialite === 'Boxing Anglaise' || athlete.specialite === 'KickBoxing'
  const isCrossfit = athlete.specialite === 'Crossfit'

  const handleChange = (section, field, value) => {
    const numericFields = [
      'poids', 'taille', 'anneesPratique', 'nombreCombats',
      'forceExplosive', 'vitesse', 'endurance', 'puissanceFrappe', 'coordination', 'souplesse',
      'competence', 'positionGarde', 'deplacement', 'jabCross', 'crochet', 'uppercut',
      'esquiveBlocage', 'enchainement', 'timingDistance', 'riposte', 'coupDePied',
      'maxPullUps', 'maxPushUp', 'maxAbdo', 'maxBurpees', 'maxGainage',
      'maxSquadMn', 'maxPress', 'maxDeadlift', 'maxSquadKg',
      'imc', 'frequenceCardiaqueRepos', 'frequenceCardiaqueMax', 'tauxMasseGraisse',
      'aspect', 'motivation', 'discipline', 'concentration', 'espritEquipe', 'gestionFatigueStress', 'Qualité', 'Evaluation'
    ];

    let finalValue = numericFields.includes(field) && value !== ''
      ? Number(value)
      : value;

    setForm(prev => {
      let newForm = { ...prev, [section]: { ...prev[section], [field]: finalValue } };

      // ✅ Recalculer IMC si poids ou taille changent
      const poids = section === 'infoGenerale' && field === 'poids'
        ? finalValue
        : newForm.infoGenerale.poids;
      const taille = section === 'infoGenerale' && field === 'taille'
        ? finalValue
        : newForm.infoGenerale.taille;

      if (poids && taille && taille > 0) {
        const imc = +(poids / (taille * taille)).toFixed(2);
        newForm.donneesBiometriques = { ...newForm.donneesBiometriques, imc };

        // ✅ Déterminer la catégorie selon l’IMC
        let categorie = '';
        if (imc < 18.5) categorie = 'Minceur';
        else if (imc < 25) categorie = 'Poids parfait';
        else if (imc < 30) categorie = 'Prise de poids';
        else if (imc < 35) categorie = 'Obésité classe 1';
        else if (imc < 40) categorie = 'Obésité classe 2';
        else categorie = 'Obésité excessive';

        newForm.donneesBiometriques.tauxMasseGraisseCategorie = categorie;
      }

      // 🔁 Calcul automatique du Win Rate
      if (section === 'niveauSportif') {
        const { totalCombats, victoires } = newForm.niveauSportif;
        if (totalCombats && victoires >= 0) {
          const winRate = totalCombats > 0 ? ((victoires / totalCombats) * 100).toFixed(2) : 0;
          newForm.niveauSportif.winRate = Number(winRate);
        }
      }


      return newForm;
    });
  };


  // Gestion des observations entraîneur
  const addObservationEntraineur = () => {
    const newObs = {
      date: new Date().toISOString().split('T')[0],
      commentaire: ''
    }
    setForm(prev => ({
      ...prev,
      observationsEntraineur: [...prev.observationsEntraineur, newObs]
    }))
    setIsObservationsOpen(true) // ✅ Ouvrir automatiquement après ajout
  }

  const updateObservationEntraineur = (index, field, value) => {
    setForm(prev => {
      const newObs = [...prev.observationsEntraineur]
      newObs[index] = { ...newObs[index], [field]: value }
      return { ...prev, observationsEntraineur: newObs }
    })
  }

  const deleteObservationEntraineur = (index) => {
    setForm(prev => ({
      ...prev,
      observationsEntraineur: prev.observationsEntraineur.filter((_, i) => i !== index)
    }))
  }

  // Gestion des commentaires parents
  const addCommentaireParent = () => {
    const newCom = {
      date: new Date().toISOString().split('T')[0],
      comportement: ''
    }
    setForm(prev => ({
      ...prev,
      commentairesParents: [...prev.commentairesParents, newCom]
    }))
    setIsCommentairesOpen(true) // ✅ Ouvrir automatiquement après ajout
  }
  const updateCommentaireParent = (index, field, value) => {
    setForm(prev => {
      const newCom = [...prev.commentairesParents]
      newCom[index] = { ...newCom[index], [field]: value }
      return { ...prev, commentairesParents: newCom }
    })
  }

  const deleteCommentaireParent = (index) => {
    setForm(prev => ({
      ...prev,
      commentairesParents: prev.commentairesParents.filter((_, i) => i !== index)
    }))
  }

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (ev) => resolve(ev.target.result)
        reader.readAsDataURL(file)
      })
    })

    Promise.all(readers).then(results => {
      setForm(prev => ({
        ...prev,
        photosProgression: [...prev.photosProgression, ...results].slice(0, 6)
      }))
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSaveMessage('')

    const updatedData = {
      infoGenerale: form.infoGenerale,
      niveauSportif: form.niveauSportif,
      profilePhysique: form.profilePhysique,
      profileTechnique: form.profileTechnique,
      donneesBiometriques: form.donneesBiometriques,
      profileMental: form.profileMental,
      objectifs: form.objectifs,
      observationsEntraineur: form.observationsEntraineur,
      commentairesParents: form.commentairesParents,
      photosProgression: form.photosProgression
    }

    console.log('📤 Données à envoyer:', updatedData)

    try {
      const result = await updateAthlete(athlete._id, updatedData)
      console.log('✅ Réponse du serveur:', result)

      // ✅ Recharger les données de l'athlète pour afficher TOUTES les observations
      setForm({
        infoGenerale: result.infoGenerale || {},
        niveauSportif: result.niveauSportif || {},
        profilePhysique: result.profilePhysique || {},
        profileTechnique: result.profileTechnique || {},
        donneesBiometriques: result.donneesBiometriques || {},
        profileMental: result.profileMental || {},
        objectifs: result.objectifs || { objectifsList: [] },
        observationsEntraineur: result.observationsEntraineur || [],
        commentairesParents: result.commentairesParents || [],
        photosProgression: result.photosProgression || []
      })

      setSaveMessage('✅ Fiche technique enregistrée avec succès!')
      setTimeout(() => setSaveMessage(''), 3000)
      setLoading(false)
      onSaved() // Fermer le formulaire
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error)
      setSaveMessage('❌ Erreur lors de la sauvegarde: ' + (error.response?.data?.message || error.message))
      setLoading(false)
    }
  }

  // ✅ NOUVELLE FONCTION : Enregistrer sans fermer
  const handleSaveWithoutClose = async () => {
    setLoading(true)
    setSaveMessage('')

    const updatedData = {
      infoGenerale: form.infoGenerale,
      niveauSportif: form.niveauSportif,
      profilePhysique: form.profilePhysique,
      profileTechnique: form.profileTechnique,
      donneesBiometriques: form.donneesBiometriques,
      profileMental: form.profileMental,
      objectifs: form.objectifs,
      observationsEntraineur: form.observationsEntraineur,
      commentairesParents: form.commentairesParents,
      photosProgression: form.photosProgression
    }

    try {
      const result = await updateAthlete(athlete._id, updatedData)

      // Recharger les données
      setForm({
        infoGenerale: result.infoGenerale || {},
        niveauSportif: result.niveauSportif || {},
        profilePhysique: result.profilePhysique || {},
        profileTechnique: result.profileTechnique || {},
        donneesBiometriques: result.donneesBiometriques || {},
        profileMental: result.profileMental || {},
        objectifs: result.objectifs || { objectifsList: [] },
        observationsEntraineur: result.observationsEntraineur || [],
        commentairesParents: result.commentairesParents || [],
        photosProgression: result.photosProgression || []
      })

      setSaveMessage('✅ Données enregistrées ! Vous pouvez continuer à modifier.')
      setTimeout(() => setSaveMessage(''), 3000)
      setLoading(false)
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error)
      setSaveMessage('❌ Erreur: ' + (error.response?.data?.message || error.message))
      setLoading(false)
    }
  }
  return (
    <div className="bg-[#0B0B0B] text-white p-6 rounded-lg max-w-6xl mx-auto max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-yellow-400">
          📋 Fiche Technique - {athlete.nom} {athlete.prenom}
        </h2>
        <button onClick={onSaved} className="text-gray-400 hover:text-yellow-400">
          <XCircle size={28} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Message de confirmation */}
        {saveMessage && (
          <div className={`p-4 rounded-lg text-center font-semibold ${saveMessage.includes('✅')
            ? 'bg-green-500/20 text-green-400 border border-green-500'
            : 'bg-red-500/20 text-red-400 border border-red-500'
            }`}>
            {saveMessage}
          </div>
        )}
        {/* SECTION 1: Info Générale */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">1. Informations Générales</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Âge</label>
              <input type="text" value={age} disabled className="w-full bg-gray-800 p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm mb-1">Catégorie d'âge</label>
              <input type="text" value={getCategorieAge(age)} disabled className="w-full bg-gray-800 p-2 rounded" />
            </div>
            {/* 🆕 Champ Sexe */}
            <div>
              <label className="block text-sm mb-1">Sexe</label>
              <select
                value={form.infoGenerale.sexe || ""}
                onChange={(e) =>
                  handleChange("infoGenerale", "sexe", e.target.value)
                }
                className="w-full bg-gray-800 p-2 rounded focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Sélectionner</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Poids (kg)</label>
              <input
                type="number"
                value={form.infoGenerale.poids || ''}
                onChange={(e) => handleChange('infoGenerale', 'poids', e.target.value)}
                className="w-full bg-gray-800 p-2 rounded focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Taille (m)</label>
              <input
                type="number"
                value={form.infoGenerale.taille || ''}
                onChange={(e) => handleChange('infoGenerale', 'taille', e.target.value)}
                className="w-full bg-gray-800 p-2 rounded focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Niveau scolaire</label>
              <input
                type="text"
                value={form.infoGenerale.niveauScolaire || ''}
                onChange={(e) => handleChange('infoGenerale', 'niveauScolaire', e.target.value)}
                className="w-full bg-gray-800 p-2 rounded focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {isBoxing && (
              <>
                <div>
                  <label className="block text-sm mb-1">Main dominante</label>
                  <select
                    value={form.infoGenerale.mainDominante || ''}
                    onChange={(e) => handleChange('infoGenerale', 'mainDominante', e.target.value)}
                    className="w-full bg-gray-800 p-2 rounded focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Droite">Droite</option>
                    <option value="Gauche">Gauche</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Catégorie de poids</label>
                  <input
                    type="text"
                    value={form.infoGenerale.categoriePoids || ''}
                    onChange={(e) => handleChange('infoGenerale', 'categoriePoids', e.target.value)}
                    className="w-full bg-gray-800 p-2 rounded focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* SECTION 2: Niveau Sportif */}
        {isBoxing && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">2. Niveau Sportif</h3>

            {/* === Infos générales du niveau === */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm mb-1">Grade</label>
                <input
                  type="text"
                  value={form.niveauSportif.gradeCeinture || ''}
                  onChange={(e) => handleChange('niveauSportif', 'gradeCeinture', e.target.value)}
                  className="w-full bg-gray-800 p-2 rounded focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Couleur de ceinture</label>
                <input
                  type="text"
                  value={form.niveauSportif.couleurCeinture || ''}
                  onChange={(e) => handleChange('niveauSportif', 'couleurCeinture', e.target.value)}
                  className="w-full bg-gray-800 p-2 rounded focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Années de pratique</label>
                <input
                  type="number"
                  value={form.niveauSportif.anneesPratique || ''}
                  onChange={(e) => handleChange('niveauSportif', 'anneesPratique', e.target.value)}
                  className="w-full bg-gray-800 p-2 rounded focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>

            {/* === Statistiques de Combat === */}
            <h4 className="text-lg font-semibold text-yellow-300 mb-2">⚔️ Statistiques de Combat</h4>
            <div className="grid grid-cols-4 gap-4">
              {/* TOTAL COMBATS */}
              <div>
                <label className="block text-sm mb-1">Total Combats</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.niveauSportif.totalCombats || ''}
                  onChange={(e) => handleChange('niveauSportif', 'totalCombats', e.target.value)}
                  className="w-full bg-gray-800 p-2 rounded focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* VICTOIRES */}
              <div>
                <label className="block text-sm mb-1">Victoires</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.niveauSportif.victoires || ''}
                  onChange={(e) => handleChange('niveauSportif', 'victoires', e.target.value)}
                  className="w-full bg-gray-800 p-2 rounded focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* DÉFAITES */}
              <div>
                <label className="block text-sm mb-1">Défaites</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.niveauSportif.defaites || ''}
                  onChange={(e) => handleChange('niveauSportif', 'defaites', e.target.value)}
                  className="w-full bg-gray-800 p-2 rounded focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* WIN RATE */}
              <div>
                <label className="block text-sm mb-1">Taux de victoire (%)</label>
                <input
                  type="number"
                  step="0.01"
                  disabled
                  value={
                    form.niveauSportif.totalCombats > 0
                      ? ((form.niveauSportif.victoires / form.niveauSportif.totalCombats) * 100).toFixed(2)
                      : 0
                  }
                  className="w-full bg-gray-700 text-gray-300 p-2 rounded cursor-not-allowed"
                />
              </div>
            </div>

            {/* === Barre de progression du taux de victoire === */}
            {form.niveauSportif.totalCombats > 0 && (
              <div className="mt-4">
                <div className="h-3 w-full bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-yellow-400 transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (form.niveauSportif.victoires / form.niveauSportif.totalCombats) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-300 mt-1 text-right">
                  {(
                    (form.niveauSportif.victoires / form.niveauSportif.totalCombats) *
                    100
                  ).toFixed(2)}% de victoires
                </p>
              </div>
            )}
          </div>
        )}


        {/* SECTION 3: Profile Physique */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">3. Profile Physique (1-10)</h3>
          <div className="grid grid-cols-3 gap-4">
            {['evaluation', 'qualité', 'forceExplosive', 'vitesse', 'endurance', 'puissanceFrappe', 'coordination', 'souplesse'].map(field => (
              <div key={field}>
                <label className="block text-sm mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.01"
                  value={form.profilePhysique[field] || ''}
                  onChange={(e) => handleChange('profilePhysique', field, e.target.value)}
                  className="w-full bg-gray-800 p-2 rounded focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: Profile Technique */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">4. Profile Technique (1-10)</h3>

          {isBoxing && (
            <div className="grid grid-cols-3 gap-4">
              {['evaluation', 'competence', 'positionGarde', 'deplacement', 'jabCross', 'crochet', 'uppercut',
                'esquiveBlocage', 'enchainement', 'timingDistance', 'riposte',
                ...(athlete.specialite === 'KickBoxing' ? ['coupDePied'] : [])
              ].map(field => (
                <div key={field}>
                  <label className="block text-sm mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.01"
                    value={form.profileTechnique[field] || ''}
                    onChange={(e) => handleChange('profileTechnique', field, e.target.value)}
                    className="w-full bg-gray-800 p-2 rounded focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              ))}
            </div>
          )}

          {isCrossfit && (
            <div className="grid grid-cols-3 gap-4">
              {[
                'maxPullUps',
                'maxPushUp',
                'maxAbdo',
                'maxBurpees',
                'maxGainage',
                'maxSquadMn',
                'maxPress',
                'maxDeadlift',
                'maxSquadKg'
              ].map(field => {
                const value = form.profileTechnique[field] || 0;

                // 💪 Seuils personnalisés par exercice
                const thresholds = {
                  maxPullUps: 10,
                  maxPushUp: 25,
                  maxAbdo: 30,
                  maxBurpees: 10,
                  maxGainage: 60,
                  maxSquadMn: 40,
                  maxPress: 0,      // pas de seuil, vert par défaut
                  maxDeadlift: 0,   // pas de seuil, vert par défaut
                  maxSquadKg: 0     // pas de seuil, vert par défaut
                };

                const limit = thresholds[field] || 0;
                let colorClass = 'bg-green-700 text-white'; // ✅ Vert si bon

                if (limit > 0) {
                  if (value < limit) colorClass = 'bg-red-700 text-white'; // 🔴 En dessous du seuil
                  else if (value === limit) colorClass = 'bg-orange-500 text-black'; // 🟠 Exactement au seuil
                }

                return (
                  <div key={field}>
                    <label className="block text-sm mb-1 capitalize">
                      {field.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      type="number"
                      value={value || ''}
                      onChange={(e) => handleChange('profileTechnique', field, e.target.value)}
                      className={`w-full p-2 rounded focus:ring-2 focus:ring-yellow-400 font-semibold transition-all duration-200 ${colorClass}`}
                    />
                  </div>
                );
              })}
            </div>
          )}


        </div>

        {/* SECTION 5: Données Biométriques */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">5. Données Biométriques</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">IMC</label>
              <input
                type="number"
                step="0.1"
                value={form.donneesBiometriques.imc || ''}
                disabled
                className="w-full bg-gray-800 p-2 rounded focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Fréquence cardiaque au repos</label>
              <input
                type="number"
                value={form.donneesBiometriques.frequenceCardiaqueRepos || ''}
                onChange={(e) => handleChange('donneesBiometriques', 'frequenceCardiaqueRepos', e.target.value)}
                className="w-full bg-gray-800 p-2 rounded focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Fréquence cardiaque maximum</label>
              <input
                type="number"
                value={form.donneesBiometriques.frequenceCardiaqueMax || ''}
                onChange={(e) => handleChange('donneesBiometriques', 'frequenceCardiaqueMax', e.target.value)}
                className="w-full bg-gray-800 p-2 rounded focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Taux de masse grasse </label>
              <input
                type="text"
                value={form.donneesBiometriques.tauxMasseGraisseCategorie || ''}
                disabled
                className="w-full bg-gray-800 p-2 rounded focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
        </div>

        {/* SECTION 6: Profile Mental */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">6. Profile Mental (1-10)</h3>
          <div className="grid grid-cols-3 gap-4">
            {['evaluation', 'aspect', 'motivation', 'discipline', 'concentration', 'espritEquipe', 'gestionFatigueStress'].map(field => (
              <div key={field}>
                <label className="block text-sm mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.01"
                  value={form.profileMental[field] || ''}
                  onChange={(e) => handleChange('profileMental', field, e.target.value)}
                  className="w-full bg-gray-800 p-2 rounded focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 7: Objectifs */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">7. Objectifs de l'athlète</h3>
          <div className="space-y-2">
            {isBoxing && (
              <>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={form.objectifs.objectifsList?.includes('Préparation compétition')}
                    onChange={(e) => {
                      const obj = 'Préparation compétition'
                      const list = form.objectifs.objectifsList || []
                      const newList = e.target.checked
                        ? [...list, obj]
                        : list.filter(o => o !== obj)
                      setForm(prev => ({
                        ...prev,
                        objectifs: { ...prev.objectifs, objectifsList: newList }
                      }))
                    }}
                  />
                  <span>Préparation compétition</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={form.objectifs.objectifsList?.includes('Amélioration technique')}
                    onChange={(e) => {
                      const obj = 'Amélioration technique'
                      const list = form.objectifs.objectifsList || []
                      const newList = e.target.checked
                        ? [...list, obj]
                        : list.filter(o => o !== obj)
                      setForm(prev => ({
                        ...prev,
                        objectifs: { ...prev.objectifs, objectifsList: newList }
                      }))
                    }}
                  />
                  <span>Amélioration technique</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={form.objectifs.objectifsList?.includes('Travail de puissance')}
                    onChange={(e) => {
                      const obj = 'Travail de puissance'
                      const list = form.objectifs.objectifsList || []
                      const newList = e.target.checked
                        ? [...list, obj]
                        : list.filter(o => o !== obj)
                      setForm(prev => ({
                        ...prev,
                        objectifs: { ...prev.objectifs, objectifsList: newList }
                      }))
                    }}
                  />
                  <span>Travail de puissance</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={form.objectifs.objectifsList?.includes('Perte de poids')}
                    onChange={(e) => {
                      const obj = 'Perte de poids'
                      const list = form.objectifs.objectifsList || []
                      const newList = e.target.checked
                        ? [...list, obj]
                        : list.filter(o => o !== obj)
                      setForm(prev => ({
                        ...prev,
                        objectifs: { ...prev.objectifs, objectifsList: newList }
                      }))
                    }}
                  />
                  <span>Perte de poids</span>
                </label>
              </>
            )}
            {isCrossfit && (
              <>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={form.objectifs.objectifsList?.includes('Perte de graisse')}
                    onChange={(e) => {
                      const obj = 'Perte de graisse'
                      const list = form.objectifs.objectifsList || []
                      const newList = e.target.checked
                        ? [...list, obj]
                        : list.filter(o => o !== obj)
                      setForm(prev => ({
                        ...prev,
                        objectifs: { ...prev.objectifs, objectifsList: newList }
                      }))
                    }}
                  />
                  <span>Perte de graisse</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={form.objectifs.objectifsList?.includes('Garde masse musculaire')}
                    onChange={(e) => {
                      const obj = 'Garde masse musculaire'
                      const list = form.objectifs.objectifsList || []
                      const newList = e.target.checked
                        ? [...list, obj]
                        : list.filter(o => o !== obj)
                      setForm(prev => ({
                        ...prev,
                        objectifs: { ...prev.objectifs, objectifsList: newList }
                      }))
                    }}
                  />
                  <span>Garde masse musculaire</span>
                </label>
              </>
            )}
          </div>
        </div>

        {/* SECTION 8: Observations Entraîneur - ACCORDÉON */}
        <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              onClick={() => setIsObservationsOpen(!isObservationsOpen)}
              className="flex items-center gap-2 text-xl font-semibold text-green-400 hover:text-green-300"
            >
              📝 Observations de l'Entraîneur ({form.observationsEntraineur.length})
              {isObservationsOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
            <button
              type="button"
              onClick={addObservationEntraineur}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              <Plus size={20} />
              Ajouter
            </button>
          </div>

          {isObservationsOpen && (
            <div className="space-y-4 mt-4">
              {form.observationsEntraineur.length === 0 ? (
                <p className="text-gray-400 text-center py-4">Aucune observation enregistrée</p>
              ) : (
                form.observationsEntraineur.map((obs, index) => (
                  <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-1 text-gray-300">Date</label>
                          <input
                            type="date"
                            value={obs.date || ''}
                            onChange={(e) => updateObservationEntraineur(index, 'date', e.target.value)}
                            className="w-full bg-gray-700 p-2 rounded focus:ring-2 focus:ring-green-400"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteObservationEntraineur(index)}
                        className="ml-4 text-red-400 hover:text-red-600"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-gray-300">Observation</label>
                      <textarea
                        value={obs.commentaire || ''}
                        onChange={(e) => updateObservationEntraineur(index, 'commentaire', e.target.value)}
                        rows={4}
                        placeholder="Saisir votre observation sur l'athlète..."
                        className="w-full bg-gray-700 p-2 rounded focus:ring-2 focus:ring-green-400"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        {/* SECTION 9: Commentaires Parents (si moins de 14 ans) */}
        {/* SECTION 9: Commentaires Parents - ACCORDÉON */}
        {age < 14 && (
          <div className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <button
                type="button"
                onClick={() => setIsCommentairesOpen(!isCommentairesOpen)}
                className="flex items-center gap-2 text-xl font-semibold text-blue-400 hover:text-blue-300"
              >
                👨‍👩‍👧 Commentaires des Parents ({form.commentairesParents.length})
                {isCommentairesOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
              <button
                type="button"
                onClick={addCommentaireParent}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                <Plus size={20} />
                Ajouter
              </button>
            </div>

            {isCommentairesOpen && (
              <div className="space-y-4 mt-4">
                {form.commentairesParents.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">Aucun commentaire parental enregistré</p>
                ) : (
                  form.commentairesParents.map((com, index) => (
                    <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm mb-1 text-gray-300">Date</label>
                            <input
                              type="date"
                              value={com.date || ''}
                              onChange={(e) => updateCommentaireParent(index, 'date', e.target.value)}
                              className="w-full bg-gray-700 p-2 rounded focus:ring-2 focus:ring-blue-400"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteCommentaireParent(index)}
                          className="ml-4 text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm mb-1 text-gray-300">Comportement observé</label>
                        <textarea
                          value={com.comportement || ''}
                          onChange={(e) => updateCommentaireParent(index, 'comportement', e.target.value)}
                          rows={4}
                          placeholder="Les parents peuvent décrire le comportement de l'enfant à la maison, sa motivation, etc..."
                          className="w-full bg-gray-700 p-2 rounded focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
        {/* Photos Progression */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">📸 Photos Avant/Après (Max 6)</h3>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            className="mb-4 text-gray-300"
          />
          <div className="grid grid-cols-3 gap-4">
            {form.photosProgression.map((photo, idx) => (
              <div key={idx} className="relative">
                <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-32 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => {
                    setForm(prev => ({
                      ...prev,
                      photosProgression: prev.photosProgression.filter((_, i) => i !== idx)
                    }))
                  }}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                >
                  <XCircle size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">


          {/* Bouton: Enregistrer et fermer */}
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 ${loading ? 'bg-yellow-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'} text-black font-bold py-3 rounded-lg flex justify-center items-center`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 10-8 8z"></path>
              </svg>
            ) : '💾 Enregistrer et fermer'}
          </button>

          {/* Bouton: Annuler */}
          <button
            type="button"
            onClick={onSaved}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}