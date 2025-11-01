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
      { title: 'TOTAL COMBATS', value: total, color: [60, 60, 60], bg: [240, 240, 240] }, // gris
      { title: 'VICTOIRES', value: victoires, color: [0, 150, 0], bg: [220, 255, 220] },   // vert clair
      { title: 'DÉFAITES', value: defaites, color: [200, 0, 0], bg: [255, 220, 220] },     // rouge clair
    ];

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);

    cards.forEach((card, index) => {
      const x = startX + index * (cardWidth + gap);
      const y = yPos;

      // === Fond coloré (bg)
      pdf.setFillColor(...card.bg);
      pdf.rect(x, y, cardWidth, cardHeight, 'F');

      // === Bordure colorée
      pdf.setDrawColor(...card.color);
      pdf.setLineWidth(1.2);
      pdf.rect(x, y, cardWidth, cardHeight);

      // === Titre (haut, petit texte gris foncé)
      pdf.setFontSize(8);
      pdf.setTextColor(80, 80, 80);
      pdf.text(card.title, x + 4, y + 8);

      // === Valeur centrée (colorée selon cadre)
      pdf.setFontSize(14);
      pdf.setTextColor(...card.color);
      const textWidth = pdf.getTextWidth(String(card.value));
      pdf.text(String(card.value), x + cardWidth / 2 - textWidth / 2, y + 18);
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
  yPos += 6;

  // === Données ===
  const profile = athlete.profilePhysique || {};

  const champs = [
    ['Évaluation', 'evaluation'],
    ['Qualité', 'qualité'],
    ['Force explosive', 'forceExplosive'],
    ['Vitesse', 'vitesse'],
    ['Endurance', 'endurance'],
    ['Puissance de frappe', 'puissanceFrappe'],
    ['Coordination', 'coordination'],
    ['Souplesse', 'souplesse']
  ];

  // === Réglages d’affichage ===
  let startY = yPos + 4;
  const lineH = 6.5;
  const colLabelX = 12;
  const colValueX = 85;
  const barX = 125;
  const barW = 45;
  const percentOffset = 4;
  const tableRight = 185;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);

  // === Boucle principale ===
  champs.forEach(([label, key], index) => {
    const valeur = parseFloat(profile[key]) || 0;
    const texte = valeur > 0 ? valeur.toFixed(2) : '-';

    // === Couleur selon la note ===
    let color = [0, 0, 0];
    let bgBar = [200, 200, 200]; // gris clair si vide
    if (valeur > 0) {
      if (valeur < 5) {
        color = [200, 0, 0];      // 🔴 rouge
        bgBar = [200, 0, 0];
      } else if (valeur < 8) {
        color = [255, 140, 0];    // 🟠 orange
        bgBar = [255, 140, 0];
      } else {
        color = [0, 150, 0];      // 🟢 vert
        bgBar = [0, 150, 0];
      }
    }

    // === Fond alterné
    if (index % 2 === 1) {
      pdf.setFillColor(245, 245, 245);
      pdf.rect(colLabelX, startY - 5.2, tableRight - colLabelX, lineH + 0.8, 'F');
    }

    // === Nom de la ligne
    pdf.setTextColor(0, 0, 0);
    pdf.text(label, colLabelX + 3, startY);

    // === Valeur numérique
    pdf.setTextColor(...color);
    pdf.text(texte, colValueX, startY);

    // === Barre colorée (toujours affichée)
    const barY = startY - 3;
    const barH = 3;
    const percent = valeur > 10 ? 1 : valeur / 10; // échelle 0-10

    pdf.setDrawColor(180);
    pdf.rect(barX, barY, barW, barH);
    pdf.setFillColor(...bgBar);
    pdf.rect(barX, barY, barW * percent, barH, 'F');

    // === Pourcentage à droite
    pdf.setFontSize(7);
    pdf.setTextColor(80);
    const displayPercent = Math.round(percent * 100);
    pdf.text(`${displayPercent}%`, barX + barW + percentOffset, barY + 2.5);
    pdf.setFontSize(9);

    // === Ligne séparatrice
    pdf.setDrawColor(230);
    pdf.setLineWidth(0.2);
    pdf.line(colLabelX, startY + 2, tableRight, startY + 2);

    startY += lineH;

    // Saut de page si besoin
    if (startY > 275) {
      pdf.addPage();
      startY = 20;
    }
  });

  yPos = startY + 8;



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
    // === Vérifier si on doit ajouter une page ===
    if (yPos > 250) {
      pdf.addPage();
      yPos = 20;
    }

    const techniqueProfile = athlete.profileTechnique || {};
    const techniqueChamps = [
      ['Évaluation', 'evaluation'],
      ['Compétence', 'competence'],
      ['Position de garde', 'positionGarde'],
      ['Déplacement', 'deplacement'],
      ['Jab-Cross (Direct)', 'jabCross'],
      ['Crochet', 'crochet'],
      ['Uppercut', 'uppercut'],
      ['Esquive / Blocage', 'esquiveBlocage'],
      ['Enchaînement', 'enchainement'],
      ['Timing / Distance', 'timingDistance'],
      ['Riposte', 'riposte']
    ];

    if (athlete.specialite === 'KickBoxing') {
      techniqueChamps.push(['Coup de pied', 'coupDePied']);
    }

    // === Réglages d’affichage ===
    let techStartY = yPos + 4;
    const techLineH = 6.5;
    const techColLabelX = 12;
    const techColValueX = 85;
    const techBarX = 125;
    const techBarW = 45;
    const techPercentOffset = 4;
    const techTableRight = 185;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);

    // === Boucle d'affichage ===
    techniqueChamps.forEach(([label, key], index) => {
      const valeur = parseFloat(techniqueProfile[key]) || 0;
      const texte = valeur > 0 ? valeur.toFixed(2) : '-';

      // === Couleur selon la note ===
      let color = [0, 0, 0];
      let bgBar = [200, 200, 200]; // gris clair si vide
      if (valeur > 0) {
        if (valeur < 5) {
          color = [200, 0, 0];      // 🔴 rouge
          bgBar = [200, 0, 0];
        } else if (valeur < 8) {
          color = [255, 140, 0];    // 🟠 orange
          bgBar = [255, 140, 0];
        } else {
          color = [0, 150, 0];      // 🟢 vert
          bgBar = [0, 150, 0];
        }
      }

      // === Fond alterné
      if (index % 2 === 1) {
        pdf.setFillColor(245, 245, 245);
        pdf.rect(techColLabelX, techStartY - 5.2, techTableRight - techColLabelX, techLineH + 0.8, 'F');
      }

      // === Nom du champ
      pdf.setTextColor(0, 0, 0);
      pdf.text(label, techColLabelX + 3, techStartY);

      // === Valeur numérique
      pdf.setTextColor(...color);
      pdf.text(texte, techColValueX, techStartY);

      // === Barre colorée (proportionnelle à 10)
      const barY = techStartY - 3;
      const barH = 3;
      const percent = valeur > 10 ? 1 : valeur / 10;

      pdf.setDrawColor(180);
      pdf.rect(techBarX, barY, techBarW, barH);
      pdf.setFillColor(...bgBar);
      pdf.rect(techBarX, barY, techBarW * percent, barH, 'F');

      // === Pourcentage à droite
      pdf.setFontSize(7);
      pdf.setTextColor(80);
      const displayPercent = Math.round(percent * 100);
      pdf.text(`${displayPercent}%`, techBarX + techBarW + techPercentOffset, barY + 2.5);
      pdf.setFontSize(9);

      // === Ligne séparatrice
      pdf.setDrawColor(230);
      pdf.setLineWidth(0.2);
      pdf.line(techColLabelX, techStartY + 2, techTableRight, techStartY + 2);

      techStartY += techLineH;

      // 🧾 Saut de page auto
      if (techStartY > 275) {
        pdf.addPage();
        techStartY = 20;
      }
    });

    yPos = techStartY + 8;
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
  pdf.text('PROFILE MENTAL (1-10)', 15, yPos);
  yPos += 6;

  const mentalProfile = athlete.profileMental || {};
  const mentalChamps = [
    ['Évaluation', 'evaluation'],
    ['Aspect', 'aspect'],
    ['Motivation', 'motivation'],
    ['Discipline', 'discipline'],
    ['Concentration', 'concentration'],
    ['Esprit d\'équipe', 'espritEquipe'],
    ['Gestion fatigue/stress', 'gestionFatigueStress']
  ];

  // === Réglages d’affichage ===
  let mentalStartY = yPos + 4;
  const mentalLineH = 6.5;
  const mentalColLabelX = 12;
  const mentalColValueX = 85;
  const mentalBarX = 125;
  const mentalBarW = 45;
  const mentalPercentOffset = 4;
  const mentalTableRight = 185;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);

  // === Boucle principale ===
  mentalChamps.forEach(([label, key], index) => {
    const valeur = parseFloat(mentalProfile[key]) || 0;
    const texte = valeur > 0 ? valeur.toFixed(2) : '-';

    // === Couleur selon la note ===
    let color = [0, 0, 0];
    let bgBar = [200, 200, 200]; // gris clair si vide
    if (valeur > 0) {
      if (valeur < 5) {
        color = [200, 0, 0];      // 🔴 rouge
        bgBar = [200, 0, 0];
      } else if (valeur < 8) {
        color = [255, 140, 0];    // 🟠 orange
        bgBar = [255, 140, 0];
      } else {
        color = [0, 150, 0];      // 🟢 vert
        bgBar = [0, 150, 0];
      }
    }

    // === Fond alterné
    if (index % 2 === 1) {
      pdf.setFillColor(245, 245, 245);
      pdf.rect(mentalColLabelX, mentalStartY - 5.2, mentalTableRight - mentalColLabelX, mentalLineH + 0.8, 'F');
    }

    // === Nom de la ligne
    pdf.setTextColor(0, 0, 0);
    pdf.text(label, mentalColLabelX + 3, mentalStartY);

    // === Valeur numérique
    pdf.setTextColor(...color);
    pdf.text(texte, mentalColValueX, mentalStartY);

    // === Barre colorée (proportionnelle à 10)
    const barY = mentalStartY - 3;
    const barH = 3;
    const percent = valeur > 10 ? 1 : valeur / 10;

    pdf.setDrawColor(180);
    pdf.rect(mentalBarX, barY, mentalBarW, barH);
    pdf.setFillColor(...bgBar);
    pdf.rect(mentalBarX, barY, mentalBarW * percent, barH, 'F');

    // === Pourcentage à droite
    pdf.setFontSize(7);
    pdf.setTextColor(80);
    const displayPercent = Math.round(percent * 100);
    pdf.text(`${displayPercent}%`, mentalBarX + mentalBarW + mentalPercentOffset, barY + 2.5);
    pdf.setFontSize(9);

    // === Ligne séparatrice
    pdf.setDrawColor(230);
    pdf.setLineWidth(0.2);
    pdf.line(mentalColLabelX, mentalStartY + 2, mentalTableRight, mentalStartY + 2);

    mentalStartY += mentalLineH;

    // Saut de page automatique
    if (mentalStartY > 275) {
      pdf.addPage();
      mentalStartY = 20;
    }
  });

  yPos = mentalStartY + 8;



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