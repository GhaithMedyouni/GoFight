'use client';
import { useEffect, useState } from 'react';
import { fetchAthletes } from '../../services/athletesService';
import TableUsers from '../dashboard/TableUsers';

export default function CrossfitPage() {
  const [athletes, setAthletes] = useState([]);

  useEffect(() => {
    fetchAthletes('Crossfit').then(setAthletes);
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">🏋️ Crossfit</h1>
      <TableUsers data={athletes} onDeleted={() => fetchAthletes('Crossfit').then(setAthletes)} />
    </div>
  );
}
