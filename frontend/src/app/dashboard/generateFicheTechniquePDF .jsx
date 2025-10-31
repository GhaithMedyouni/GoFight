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


  const categorieAge = getCategorieAge(age);
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
  pdf.text('INFORMATIONS GÉNÉRALES', 50, yPos);
  yPos += 8;

  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);

  const infoGen = athlete.infoGenerale || {};
  const isKidsCategory = ['Pre-poussin', 'Poussin', 'École', 'Minimes', 'Cadet'].includes(categorieAge);
  const specialiteAffichee = isKidsCategory ? `${athlete.specialite} (Kids)` : athlete.specialite;
  const infoData = [
    ['Nom', athlete.nom],
    ['Prénom', athlete.prenom],
    ['Âge', `${age} ans`],
    ['Sexe', infoGen.sexe || '-'],
    ['Catégorie d\'âge', getCategorieAge(age)],
    ['Poids', infoGen.poids ? `${infoGen.poids} kg` : '-'],
    ['Taille', infoGen.taille ? `${infoGen.taille} m` : '-'],
    ['Niveau scolaire', infoGen.niveauScolaire || '-'],
    ['Spécialité', specialiteAffichee],
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
  if (isBoxing) {
    pdf.setFontSize(14);
    pdf.setTextColor(255, 214, 10);
    pdf.text('NIVEAU SPORTIF', 15, yPos);
    yPos += 8;

    const niveauSportif = athlete.niveauSportif || {};

    // === Tableau classique (Grade, Couleur ceinture, Années de pratique)
    const niveauData = [
      ['Grade', niveauSportif.gradeCeinture || '-'],
      ['Couleur ceinture', niveauSportif.couleurCeinture || '-'],
      ['Années de pratique', niveauSportif.anneesPratique || '-'],
    ];

    pdf.autoTable({
      startY: yPos,
      body: niveauData,
      theme: 'grid',
      styles: { fontSize: 9, textColor: [0, 0, 0], fillColor: [255, 255, 255] },
      head: [['Informations', 'Valeurs']],
      headStyles: { fillColor: [255, 214, 10], textColor: [0, 0, 0] },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      margin: { left: 15 },
    });

    yPos = pdf.lastAutoTable.finalY + 12;

    // === Statistiques de combat en 3 cartes alignées ===
    const total = niveauSportif.totalCombats || 0;
    const victoires = niveauSportif.victoires || 0;
    const defaites = niveauSportif.defaites || 0;
    const winRate = total > 0 ? ((victoires / total) * 100).toFixed(2) : '0.00';

    const cardWidth = 35;
    const cardHeight = 25;
    const startX = 15;
    const gap = 20;

    const cards = [
      { title: 'TOTAL COMBATS', value: total },
      { title: 'VICTOIRES', value: victoires },
      { title: 'DÉFAITES', value: defaites },
    ];

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);

    cards.forEach((card, index) => {
      const x = startX + index * (cardWidth + gap);
      const y = yPos;
      // cadre
      pdf.setDrawColor(0);
      pdf.setLineWidth(0.5);
      pdf.rect(x, y, cardWidth, cardHeight);
      // titre
      pdf.setFontSize(8);
      pdf.setTextColor(80);
      pdf.text(card.title, x + 4, y + 8);
      // valeur centrée
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text(String(card.value), x + cardWidth / 2 - 3, y + 20);
    });

    yPos += cardHeight + 15;

    // === Titre WIN RATE ===
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text('WIN RATE', 15, yPos);

    // === Barre de progression du Win Rate ===
    const barX = 15;
    const barY = yPos + 4;
    const barWidth = 160;
    const barHeight = 8;

    pdf.setDrawColor(0);
    pdf.rect(barX, barY, barWidth, barHeight);
    pdf.setFillColor(0, 0, 0);
    pdf.rect(barX, barY, (barWidth * winRate) / 100, barHeight, 'F');

    // === Pourcentage affiché à droite ===
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${winRate}%`, barX + barWidth + 5, barY + 6);

    yPos += 20;
  }



  // === SECTION 3: PROFILE PHYSIQUE ===
  if (yPos > 250) {
    pdf.addPage();
    yPos = 20;
  }

  pdf.setFontSize(14);
  pdf.setTextColor(255, 214, 10);
  pdf.text('PROFILE PHYSIQUE (1-10)', 15, yPos);
  yPos += 8;

  const profilePhysique = athlete.profilePhysique || {};
  const physiqueData = [
    ['Evaluation', profilePhysique.evaluation || '-'],
    ['Qualité', profilePhysique.qualité || '-'],
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
  pdf.text('PROFILE TECHNIQUE (1-10)', 15, yPos);
  yPos += 8;

  const profileTechnique = athlete.profileTechnique || {};
  let techniqueData = [];

  if (isBoxing) {
    techniqueData = [
      ['Evaluation', profileTechnique.evaluation || '-'],
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
  const profile = profileTechnique || {};

  const seuils = {
    maxPullUps: 10,
    maxPushUp: 25,
    maxAbdo: 30,
    maxBurpees: 10,
    maxGainage: 60,
    maxSquadMn: 40
  };

  const exercices = [
    ['Max Pull-ups (min)', 'maxPullUps', 'par min'],
    ['Max Push-ups (min)', 'maxPushUp', 'par min'],
    ['Max Abdos (min)', 'maxAbdo', 'par min'],
    ['Max Burpees (min)', 'maxBurpees', 'par min'],
    ['Max Gainage', 'maxGainage', 'sec'],
    ['Max Squat (min)', 'maxSquadMn', 'par min'],
    ['Max Press (kg)', 'maxPress', 'Kg'],
    ['Max Deadlift (kg)', 'maxDeadlift', 'Kg'],
    ['Max Squat (kg)', 'maxSquadKg', 'Kg']
  ];

  // === Réglages précis ===
  let startY = yPos + 5;
  const lineH = 6.5;          // 🔹 plus compact
  const colLabelX = 12;       // aligné à gauche
  const colValueX = 90;       // un peu rapproché
  const barX = 130;           // début des barres
  const barW = 45;            // largeur légèrement réduite
  const percentOffset = 4;
  const tableRight = 185;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);         // 🔹 police réduite

  exercices.forEach(([label, key, unite], index) => {
    const valeur = parseFloat(profile[key]) || 0;
    const texte = valeur > 0 ? `${valeur} ${unite}` : '-';
    const seuil = seuils[key];

    let color = [0, 0, 0];
    let percent = 1;
    if (seuil) {
      percent = Math.min(valeur / seuil, 1);
      if (valeur < seuil) color = [200, 0, 0];
      else if (valeur === seuil) color = [255, 140, 0];
      else color = [0, 150, 0];
    }

    // === Fond alterné ===
    if (index % 2 === 1) {
      pdf.setFillColor(245, 245, 245);
      pdf.rect(colLabelX, startY - 5.2, tableRight - colLabelX, lineH + 0.8, 'F');
    }

    // === Correction première ligne ===
    const yCorrection = index === 0 ? -0.8 : 0;

    // === Nom de l’exercice ===
    pdf.setTextColor(0, 0, 0);
    pdf.text(label, colLabelX + 3, startY + yCorrection);

    // === Valeur ===
    pdf.setTextColor(...color);
    pdf.text(texte, colValueX, startY + yCorrection);

    // === Barres pour les 6 premiers ===
    if (index < 6) {
      const barY = startY - 3 + yCorrection;
      const barH = 3;

      pdf.setDrawColor(180);
      pdf.rect(barX, barY, barW, barH);
      const filledWidth = seuil ? barW * percent : barW;
      pdf.setFillColor(...color);
      pdf.rect(barX, barY, filledWidth, barH, 'F');

      const displayPercent = seuil ? Math.round((valeur / seuil) * 100) : 100;
      pdf.setFontSize(7);
      pdf.setTextColor(80);
      pdf.text(`${displayPercent}%`, barX + barW + percentOffset, barY + 2.5);
      pdf.setFontSize(9); // rétablit taille
    }

    // === Ligne séparatrice ===
    pdf.setDrawColor(230);
    pdf.setLineWidth(0.2);
    pdf.line(colLabelX, startY + 2, tableRight, startY + 2);

    startY += lineH;

    // 🧾 auto saut page si besoin
    if (startY > 275) {
      pdf.addPage();
      startY = 20;
    }
  });

  yPos = startY + 8;
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
  pdf.text('DONNÉES BIOMÉTRIQUES', 15, yPos);
  yPos += 8;

  const biometrique = athlete.donneesBiometriques || {};
  const biometriqueData = [
    ['IMC', biometrique.imc || '-'],
    ['Fréquence cardiaque repos', biometrique.frequenceCardiaqueRepos || '-'],
    ['Fréquence cardiaque max', biometrique.frequenceCardiaqueMax || '-'],
    ['Taux masse grasse ', biometrique.tauxMasseGraisseCategorie || '-']
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
  pdf.text('ROFILE MENTAL (1-10)', 15, yPos);
  yPos += 8;

  const profileMental = athlete.profileMental || {};
  const mentalData = [
    ['Evaluation', profileMental.evaluation || '-'],
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
  pdf.text('OBJECTIFS DE L\'ATHLÈTE', 15, yPos);
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
    pdf.text('OBSERVATIONS DE L\'ENTRAÎNEUR', 15, yPos);
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
      pdf.text(`Date: ${obs.date ? new Date(obs.date).toLocaleDateString('fr-FR') : '-'}`, 20, yPos);
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
    pdf.text('COMMENTAIRES DES PARENTS', 15, yPos);
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
      pdf.text(`Date: ${com.date ? new Date(com.date).toLocaleDateString('fr-FR') : '-'}`, 20, yPos);
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