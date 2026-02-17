import { useState } from 'react';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import StatsDashboard from './components/StatsDashboard';

function App() {
  const [refreshTickets, setRefreshTickets] = useState(0);

  const handleTicketCreated = () => {
    setRefreshTickets(prev => prev + 1);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Support Ticket System</h1>
      
      <StatsDashboard refresh={refreshTickets} />
      
      <h2>Submit New Ticket</h2>
      <TicketForm onTicketCreated={handleTicketCreated} />
      
      <h2>Tickets</h2>
      <TicketList refresh={refreshTickets} />
    </div>
  );
}

export default App;