import { useState, useEffect } from 'react';
import API from '../services/api';

function StatsDashboard({ refresh }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await API.get('/tickets/stats/');
      setStats(res.data);
    } catch (err) {
      console.log('Failed to fetch stats');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, [refresh]);

  if (loading) return <p>Loading stats...</p>;
  if (!stats) return <p>No stats available</p>;

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0' }}>
      <h2>Dashboard</h2>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <div>
          <h3>Total Tickets</h3>
          <p>{stats.total_tickets}</p>
        </div>
        <div>
          <h3>Open Tickets</h3>
          <p>{stats.open_tickets}</p>
        </div>
        <div>
          <h3>Avg Per Day</h3>
          <p>{stats.avg_tickets_per_day}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '40px' }}>
        <div>
          <h3>By Priority</h3>
          {Object.entries(stats.priority_breakdown).map(([key, value]) => (
            <p key={key}>{key}: {value}</p>
          ))}
        </div>
        
        <div>
          <h3>By Category</h3>
          {Object.entries(stats.category_breakdown).map(([key, value]) => (
            <p key={key}>{key}: {value}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatsDashboard;