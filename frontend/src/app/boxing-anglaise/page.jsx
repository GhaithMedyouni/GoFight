'use client';
import { useEffect, useState } from 'react';
import { fetchAthletes } from '../../services/athletesService';
import TableUsers from '../dashboard/TableUsers';

export default function BoxingPage() {
  const [athletes, setAthletes] = useState([]);

  useEffect(() => {
    fetchAthletes('Boxing Anglaise').then(setAthletes);
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">🥊 Boxing Anglaise</h1>
      <TableUsers data={athletes} onDeleted={() => fetchAthletes('Boxing Anglaise').then(setAthletes)} />
    </div>
  );
}
