import { useState } from 'react';
import API from '../services/api';

function TicketForm({ onTicketCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    user_category: '',
    user_priority: '',
    status: 'open'
  });
  
  const [loading, setLoading] = useState(false);
  const [classifying, setClassifying] = useState(false);

  const handleDescriptionBlur = async () => {
    if (!formData.description.trim()) return;
    
    setClassifying(true);
    try {
      const res = await API.post('/tickets/classify/', {
        description: formData.description
      });
      setFormData(prev => ({
        ...prev,
        user_category: res.data.suggested_category,
        user_priority: res.data.suggested_priority
      }));
    } catch (err) {
      console.log('Classification failed');
    }
    setClassifying(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/tickets/', formData);
      setFormData({ title: '', description: '', user_category: '', user_priority: '', status: 'open' });
      onTicketCreated();
    } catch (err) {
      console.log('Submit failed');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={e => setFormData({...formData, title: e.target.value})}
        required
        maxLength="200"
      />
      
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={e => setFormData({...formData, description: e.target.value})}
        onBlur={handleDescriptionBlur}
        required
      />
      
      {classifying && <p>Analyzing with AI...</p>}
      
      <select
        value={formData.user_category}
        onChange={e => setFormData({...formData, user_category: e.target.value})}
        required
      >
        <option value="">Select Category</option>
        <option value="billing">Billing</option>
        <option value="technical">Technical</option>
        <option value="account">Account</option>
        <option value="general">General</option>
      </select>
      
      <select
        value={formData.user_priority}
        onChange={e => setFormData({...formData, user_priority: e.target.value})}
        required
      >
        <option value="">Select Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Ticket'}
      </button>
    </form>
  );
}

export default TicketForm;