import { useState, useEffect } from 'react';
import API from '../services/api';

function TicketList({ refresh }) {
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    status: '',
    search: ''
  });
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      
      const res = await API.get(`/tickets/?${params.toString()}`);
      setTickets(res.data);
    } catch (err) {
      console.log('Failed to fetch tickets');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, [filters, refresh]);

  const updateStatus = async (id, newStatus) => {
    try {
      await API.patch(`/tickets/${id}/`, { status: newStatus });
      fetchTickets();
    } catch (err) {
      console.log('Status update failed');
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search tickets..."
          value={filters.search}
          onChange={e => setFilters({...filters, search: e.target.value})}
        />
        
        <select onChange={e => setFilters({...filters, category: e.target.value})}>
          <option value="">All Categories</option>
          <option value="billing">Billing</option>
          <option value="technical">Technical</option>
          <option value="account">Account</option>
          <option value="general">General</option>
        </select>
        
        <select onChange={e => setFilters({...filters, priority: e.target.value})}>
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        
        <select onChange={e => setFilters({...filters, status: e.target.value})}>
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {loading ? <p>Loading...</p> : (
        <div>
          {tickets.map(ticket => (
            <div key={ticket.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <h3>{ticket.title}</h3>
              <p>{ticket.description.substring(0, 100)}...</p>
              <p>Category: {ticket.user_category} | Priority: {ticket.user_priority} | Status: {ticket.status}</p>
              <p>Created: {new Date(ticket.created_at).toLocaleString()}</p>
              <select 
                value={ticket.status}
                onChange={e => updateStatus(ticket.id, e.target.value)}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TicketList;