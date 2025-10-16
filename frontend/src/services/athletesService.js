import axios from "axios";

const API_URL = "http://localhost:5000/athletes"; // 🔗 ton backend NestJS

// ⚙️ Récupérer tous les athlètes (option : filtrer par spécialité)
export const fetchAthletes = async (specialite = "") => {
  try {
    const url = specialite ? `${API_URL}?specialite=${specialite}` : API_URL;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error("❌ Erreur fetchAthletes:", error);
    throw error;
  }
};

// ➕ Ajouter un athlète
export const createAthlete = async (athleteData) => {
  try {
    const res = await axios.post(API_URL, athleteData);
    return res.data;
  } catch (error) {
    console.error("❌ Erreur createAthlete:", error);
    throw error;
  }
};

// ✏️ Modifier un athlète
export const updateAthlete = async (id, updatedData) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, updatedData);
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
