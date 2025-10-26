import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateFicheTechniquePDF = (athlete) => {
  const pdf = new jsPDF();
  let yPos = 20;

  // Calcul de l'âge
  const age = athlete.dateNaissance 
    ? Math.floor((new Date() - new Date(athlete.dateNaissance)) / 31557600000)
    : 0;

  const getCategorieAge = (age) => {
    if (age <= 6) return 'Pre-poussin';
    if (age <= 9) return 'Poussin';
    if (age <= 12) return 'École';
    if (age <= 13) return 'Minimes';
    if (age <= 15) return 'Cadet';
    if (age <= 18) return 'Junior';
    return 'Senior';
  };

  const isBoxing = athlete.specialite === 'Boxing Anglaise' || athlete.specialite === 'KickBoxing';
  const isCrossfit = athlete.specialite === 'Crossfit';

  // === HEADER ===
  pdf.setFillColor(255, 214, 10);
  pdf.rect(0, 0, 210, 30, 'F');
  pdf.setFontSize(20);
  pdf.setTextColor(0, 0, 0);
  pdf.text('FICHE TECHNIQUE ATHLÈTE', 105, 15, { align: 'center' });
  pdf.setFontSize(12);
  pdf.text(`${athlete.nom} ${athlete.prenom}`, 105, 23, { align: 'center' });

  // Photo
  if (athlete.photo) {
    try {
      pdf.addImage(athlete.photo, 'JPEG', 15, 35, 30, 30);
    } catch (e) {
      console.error('Erreur ajout photo:', e);
    }
  }

  yPos = 40;

  // === SECTION 1: INFORMATIONS GÉNÉRALES ===
  pdf.setFontSize(14);
  pdf.setTextColor(255, 214, 10);
  pdf.text('1. INFORMATIONS GÉNÉRALES', 50, yPos);
  yPos += 8;

  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  const infoGen = athlete.infoGenerale || {};
  const infoData = [
    ['Nom', athlete.nom],
    ['Prénom', athlete.prenom],
    ['Âge', `${age} ans`],
    ['Catégorie d\'âge', getCategorieAge(age)],
    ['Poids', infoGen.poids ? `${infoGen.poids} kg` : '-'],
    ['Taille', infoGen.taille ? `${infoGen.taille} cm` : '-'],
    ['Niveau scolaire', infoGen.niveauScolaire || '-'],
    ['Spécialité', athlete.specialite],
  ];

  if (isBoxing) {
    infoData.push(['Main dominante', infoGen.mainDominante || '-']);
    infoData.push(['Catégorie de poids', infoGen.categoriePoids || '-']);
  }

  pdf.autoTable({
    startY: yPos,
    head: [],
    body: infoData,
    theme: 'grid',
    styles: { fontSize: 9, textColor: [0, 0, 0], fillColor: [255, 255, 255] },
    headStyles: { fillColor: [255, 214, 10], textColor: [0, 0, 0] },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    margin: { left: 50 }
  });

  yPos = pdf.lastAutoTable.finalY + 10;

  // === SECTION 2: NIVEAU SPORTIF ===
  pdf.setFontSize(14);
  pdf.setTextColor(255, 214, 10);
  pdf.text('2. NIVEAU SPORTIF', 15, yPos);
  yPos += 8;

  const niveauSportif = athlete.niveauSportif || {};
  const niveauData = [
    ['Grade', niveauSportif.gradeCeinture || '-'],
    ['Couleur ceinture', niveauSportif.couleurCeinture || '-'],
    ['Années de pratique', niveauSportif.anneesPratique || '-'],
    ['Nombre de combats', niveauSportif.nombreCombats || '-']
  ];

  pdf.autoTable({
    startY: yPos,
    body: niveauData,
    theme: 'grid',
    styles: { fontSize: 9, textColor: [0, 0, 0], fillColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [250, 250, 250] }
  });

  yPos = pdf.lastAutoTable.finalY + 10;

  // === SECTION 3: PROFILE PHYSIQUE ===
  if (yPos > 250) {
    pdf.addPage();
    yPos = 20;
  }

  pdf.setFontSize(14);
  pdf.setTextColor(255, 214, 10);
  pdf.text('3. PROFILE PHYSIQUE (1-10)', 15, yPos);
  yPos += 8;

  const profilePhysique = athlete.profilePhysique || {};
  const physiqueData = [
    ['Force explosive', profilePhysique.forceExplosive || '-'],
    ['Vitesse', profilePhysique.vitesse || '-'],
    ['Endurance', profilePhysique.endurance || '-'],
    ['Puissance de frappe', profilePhysique.puissanceFrappe || '-'],
    ['Coordination', profilePhysique.coordination || '-'],
    ['Souplesse', profilePhysique.souplesse || '-']
  ];

  pdf.autoTable({
    startY: yPos,
    body: physiqueData,
    theme: 'grid',
    styles: { fontSize: 9, textColor: [0, 0, 0], fillColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [250, 250, 250] }
  });

  yPos = pdf.lastAutoTable.finalY + 10;

  // === SECTION 4: PROFILE TECHNIQUE ===
  if (yPos > 250) {
    pdf.addPage();
    yPos = 20;
  }

  pdf.setFontSize(14);
  pdf.setTextColor(255, 214, 10);
  pdf.text('4. PROFILE TECHNIQUE (1-10)', 15, yPos);
  yPos += 8;

  const profileTechnique = athlete.profileTechnique || {};
  let techniqueData = [];

  if (isBoxing) {
    techniqueData = [
      ['Compétence', profileTechnique.competence || '-'],
      ['Position de garde', profileTechnique.positionGarde || '-'],
      ['Déplacement', profileTechnique.deplacement || '-'],
      ['Jab-Cross (Direct)', profileTechnique.jabCross || '-'],
      ['Crochet', profileTechnique.crochet || '-'],
      ['Uppercut', profileTechnique.uppercut || '-'],
      ['Esquive/Blocage', profileTechnique.esquiveBlocage || '-'],
      ['Enchaînement', profileTechnique.enchainement || '-'],
      ['Timing/Distance', profileTechnique.timingDistance || '-'],
      ['Riposte', profileTechnique.riposte || '-']
    ];

    if (athlete.specialite === 'KickBoxing') {
      techniqueData.push(['Coup de pied', profileTechnique.coupDePied || '-']);
    }
  }

  if (isCrossfit) {
    techniqueData = [
      ['Max Pull-ups', profileTechnique.maxPullUps || '-'],
      ['Max Push-ups', profileTechnique.maxPushUp || '-'],
      ['Max Abdos', profileTechnique.maxAbdo || '-'],
      ['Max Burpees', profileTechnique.maxBurpees || '-'],
      ['Max Gainage', profileTechnique.maxGainage || '-'],
      ['Max Squat (min)', profileTechnique.maxSquadMn || '-'],
      ['Max Press', profileTechnique.maxPress || '-'],
      ['Max Deadlift', profileTechnique.maxDeadlift || '-'],
      ['Max Squat (kg)', profileTechnique.maxSquadKg || '-']
    ];
  }

  pdf.autoTable({
    startY: yPos,
    body: techniqueData,
    theme: 'grid',
    styles: { fontSize: 9, textColor: [0, 0, 0], fillColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [250, 250, 250] }
  });

  yPos = pdf.lastAutoTable.finalY + 10;

  // === SECTION 5: DONNÉES BIOMÉTRIQUES ===
  if (yPos > 230) {
    pdf.addPage();
    yPos = 20;
  }

  pdf.setFontSize(14);
  pdf.setTextColor(255, 214, 10);
  pdf.text('5. DONNÉES BIOMÉTRIQUES', 15, yPos);
  yPos += 8;

  const biometrique = athlete.donneesBiometriques || {};
  const biometriqueData = [
    ['IMC', biometrique.imc || '-'],
    ['Fréquence cardiaque repos', biometrique.frequenceCardiaqueRepos || '-'],
    ['Fréquence cardiaque max', biometrique.frequenceCardiaqueMax || '-'],
    ['Taux masse grasse (%)', biometrique.tauxMasseGraisse || '-']
  ];

  pdf.autoTable({
    startY: yPos,
    body: biometriqueData,
    theme: 'grid',
    styles: { fontSize: 9, textColor: [0, 0, 0], fillColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [250, 250, 250] }
  });

  yPos = pdf.lastAutoTable.finalY + 10;

  // === SECTION 6: PROFILE MENTAL ===
  if (yPos > 230) {
    pdf.addPage();
    yPos = 20;
  }

  pdf.setFontSize(14);
  pdf.setTextColor(255, 214, 10);
  pdf.text('6. PROFILE MENTAL (1-10)', 15, yPos);
  yPos += 8;

  const profileMental = athlete.profileMental || {};
  const mentalData = [
    ['Aspect', profileMental.aspect || '-'],
    ['Motivation', profileMental.motivation || '-'],
    ['Discipline', profileMental.discipline || '-'],
    ['Concentration', profileMental.concentration || '-'],
    ['Esprit d\'équipe', profileMental.espritEquipe || '-'],
    ['Gestion fatigue/stress', profileMental.gestionFatigueStress || '-']
  ];

  pdf.autoTable({
    startY: yPos,
    body: mentalData,
    theme: 'grid',
    styles: { fontSize: 9, textColor: [0, 0, 0], fillColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [250, 250, 250] }
  });

  yPos = pdf.lastAutoTable.finalY + 10;

  // === SECTION 7: OBJECTIFS ===
  if (yPos > 230) {
    pdf.addPage();
    yPos = 20;
  }

  pdf.setFontSize(14);
  pdf.setTextColor(255, 214, 10);
  pdf.text('7. OBJECTIFS DE L\'ATHLÈTE', 15, yPos);
  yPos += 8;

  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  const objectifs = athlete.objectifs?.objectifsList || [];
  if (objectifs.length > 0) {
    objectifs.forEach((obj) => {
      pdf.text(`• ${obj}`, 15, yPos);
      yPos += 6;
    });
  } else {
    pdf.text('Aucun objectif défini', 15, yPos);
    yPos += 6;
  }

  yPos += 5;

  // === SECTION 8: OBSERVATIONS ENTRAÎNEUR ===
  if (athlete.observationsEntraineur && athlete.observationsEntraineur.length > 0) {
    if (yPos > 220) {
      pdf.addPage();
      yPos = 20;
    }

    pdf.setFontSize(14);
    pdf.setTextColor(34, 197, 94); // Couleur verte
    pdf.text('8. OBSERVATIONS DE L\'ENTRAÎNEUR', 15, yPos);
    yPos += 10;

    athlete.observationsEntraineur.forEach((obs, index) => {
      // Vérifier l'espace disponible
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }

      // Encadré pour chaque observation
      pdf.setDrawColor(34, 197, 94);
      pdf.setLineWidth(0.5);
      
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`📅 Date: ${obs.date ? new Date(obs.date).toLocaleDateString('fr-FR') : '-'}`, 20, yPos);
      yPos += 6;

      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      const lines = pdf.splitTextToSize(obs.commentaire || 'Aucun commentaire', 170);
      pdf.text(lines, 20, yPos);
      yPos += lines.length * 5 + 8;

      // Ligne de séparation
      if (index < athlete.observationsEntraineur.length - 1) {
        pdf.setDrawColor(200, 200, 200);
        pdf.line(15, yPos - 3, 195, yPos - 3);
        yPos += 5;
      }
    });

    yPos += 5;
  }

  // === SECTION 9: COMMENTAIRES PARENTS (si moins de 14 ans) ===
  if (age < 14 && athlete.commentairesParents && athlete.commentairesParents.length > 0) {
    if (yPos > 220) {
      pdf.addPage();
      yPos = 20;
    }

    pdf.setFontSize(14);
    pdf.setTextColor(59, 130, 246); // Couleur bleue
    pdf.text('9. COMMENTAIRES DES PARENTS', 15, yPos);
    yPos += 10;

    athlete.commentairesParents.forEach((com, index) => {
      // Vérifier l'espace disponible
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }

      pdf.setDrawColor(59, 130, 246);
      pdf.setLineWidth(0.5);
      
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`📅 Date: ${com.date ? new Date(com.date).toLocaleDateString('fr-FR') : '-'}`, 20, yPos);
      yPos += 6;

      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      const lines = pdf.splitTextToSize(com.comportement || 'Aucun commentaire', 170);
      pdf.text(lines, 20, yPos);
      yPos += lines.length * 5 + 8;

      // Ligne de séparation
      if (index < athlete.commentairesParents.length - 1) {
        pdf.setDrawColor(200, 200, 200);
        pdf.line(15, yPos - 3, 195, yPos - 3);
        yPos += 5;
      }
    });

    yPos += 5;
  }

  // === PHOTOS PROGRESSION ===
  if (athlete.photosProgression && athlete.photosProgression.length > 0) {
    // Nouvelle page pour les photos
    pdf.addPage();
    yPos = 20;

    pdf.setFontSize(14);
    pdf.setTextColor(255, 214, 10);
    pdf.text('PHOTOS AVANT/APRÈS - PROGRESSION', 15, yPos);
    yPos += 10;

    let xPos = 15;
    let photoCount = 0;
    let rowCount = 0;
    
    athlete.photosProgression.slice(0, 6).forEach((photo, idx) => {
      try {
        // 3 photos par ligne
        if (photoCount === 3) {
          yPos += 55;
          xPos = 15;
          photoCount = 0;
          rowCount++;
        }

        // Nouvelle page si nécessaire
        if (rowCount === 4) {
          pdf.addPage();
          yPos = 20;
          rowCount = 0;
        }
        
        pdf.addImage(photo, 'JPEG', xPos, yPos, 45, 45);
        
        // Numéro de la photo
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Photo ${idx + 1}`, xPos + 15, yPos + 50);
        
        xPos += 50;
        photoCount++;
      } catch (e) {
        console.error('Erreur ajout photo progression:', e);
      }
    });
  }

  // === FOOTER ===
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Page ${i} / ${pageCount}`, 105, 290, { align: 'center' });
    pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 15, 290);
  }

  // Télécharger le PDF
  pdf.save(`Fiche_Technique_${athlete.nom}_${athlete.prenom}.pdf`);
};