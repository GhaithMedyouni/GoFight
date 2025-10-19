'use client';

import { useEffect, useState } from 'react';
import { fetchAthletes } from '../../services/athletesService';
import TableUsers from '../dashboard/TableUsers';
import LoadingSpinner from '../../components/LoadingSpinner'; // si tu veux un loader

export default function KickBoxingPage() {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAthletes('KickBoxing');
      setAthletes(data);
    } catch (err) {
      console.error('Erreur chargement KickBoxing:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">🏅 KickBoxing</h1>

      {loading ? (
        <div className="text-gray-400">Chargement...</div>
      ) : (
        <TableUsers
          data={athletes}
          onDeleted={loadData}
          onEdit={(u) => console.log('Edit:', u)}
        />
      )}
    </div>
  );
}
