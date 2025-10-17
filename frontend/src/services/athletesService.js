import axios from "axios";

// ✅ Définir l’URL principale (prod ou dev)
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const API_URL = `${BASE_URL}/athletes`;

// ⚙️ Récupérer tous les athlètes
export const fetchAthletes = async (specialite = "") => {
  try {
    const url = specialite ? `${API_URL}?specialite=${specialite}` : API_URL;
    const res = await axios.get(url, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    console.error("❌ Erreur fetchAthletes:", error);
    throw error;
  }
};

// ➕ Ajouter un athlète
export const createAthlete = async (athleteData) => {
  try {
    const res = await axios.post(API_URL, athleteData, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    console.error("❌ Erreur createAthlete:", error);
    throw error;
  }
};

// ✏️ Modifier un athlète
export const updateAthlete = async (id, updatedData) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, updatedData, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    console.error("❌ Erreur updateAthlete:", error);
    throw error;
  }
};

// 🗑️ Supprimer un athlète
export const deleteAthlete = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Erreur deleteAthlete:", error);
    throw error;
  }
};
