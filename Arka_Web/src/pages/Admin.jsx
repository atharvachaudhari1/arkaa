import { useState, useEffect } from 'react';
import { Users, Mail, Monitor, Building, Target, Crown, Calendar } from 'lucide-react';

const Admin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/Arka-requests');
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
      } else {
        throw new Error('Failed to fetch requests');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPlatformIcon = (product) => {
    switch (product) {
      case 'windows': return '🪟';
      case 'linux': return '🐧';
      case 'macos': return '🍎';
      default: return '💻';
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-header">
          <h1>Arka Requests Admin</h1>
        </div>
        <div className="loading">Loading requests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="admin-header">
          <h1>Arka Requests Admin</h1>
        </div>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Arka Requests Admin</h1>
        <div className="admin-stats">
          <div className="stat-card">
            <Users className="stat-icon" />
            <div>
              <div className="stat-number">{requests.length}</div>
              <div className="stat-label">Total Requests</div>
            </div>
          </div>
          <div className="stat-card">
            <Crown className="stat-icon" />
            <div>
              <div className="stat-number">
                {requests.filter(r => r.premiumType === 'enterprise').length}
              </div>
              <div className="stat-label">Enterprise</div>
            </div>
          </div>
          <div className="stat-card">
            <Monitor className="stat-icon" />
            <div>
              <div className="stat-number">
                {requests.filter(r => r.product === 'windows').length}
              </div>
              <div className="stat-label">Windows</div>
            </div>
          </div>
        </div>
      </div>

      <div className="requests-grid">
        {requests.length === 0 ? (
          <div className="no-requests">No requests found</div>
        ) : (
          requests.map((request) => (
            <div key={request._id} className="request-card">
              <div className="request-header">
                <div className="request-user">
                  <Users className="request-icon" />
                  <div>
                    <div className="user-name">{request.userName}</div>
                    <div className="user-email">{request.userEmail}</div>
                  </div>
                </div>
                <div className="request-date">
                  <Calendar className="request-icon" />
                  {formatDate(request.createdAt)}
                </div>
              </div>

              <div className="request-details">
                <div className="detail-row">
                  <Monitor className="detail-icon" />
                  <span className="detail-label">Platform:</span>
                  <span className="detail-value">
                    {getPlatformIcon(request.product)} {request.product}
                  </span>
                </div>

                <div className="detail-row">
                  <Crown className="detail-icon" />
                  <span className="detail-label">Premium:</span>
                  <span className={`detail-value premium-${request.premiumType}`}>
                    {request.premiumType}
                  </span>
                </div>

                {request.organisation && (
                  <div className="detail-row">
                    <Building className="detail-icon" />
                    <span className="detail-label">Organization:</span>
                    <span className="detail-value">{request.organisation}</span>
                  </div>
                )}

                <div className="detail-row purpose-row">
                  <Target className="detail-icon" />
                  <span className="detail-label">Purpose:</span>
                  <div className="purpose-text">{request.purpose}</div>
                </div>
              </div>

              <div className="request-status">
                <span className={`status-badge status-${request.status}`}>
                  {request.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Admin;