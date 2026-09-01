import React from 'react';
import { Layers, Clock, Loader2, CheckCircle2 } from 'lucide-react';

const StatsCard = ({ stats }) => {
  const items = [
    { label: 'Total Complaints', count: stats?.total || 0, type: 'total', icon: Layers },
    { label: 'Pending', count: stats?.pending || 0, type: 'pending', icon: Clock },
    { label: 'In Progress', count: stats?.inProgress || 0, type: 'inprogress', icon: Loader2 },
    { label: 'Resolved', count: stats?.resolved || 0, type: 'resolved', icon: CheckCircle2 },
  ];

  return (
    <div className="stats-grid">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="stat-card">
            <div className={`stat-icon ${item.type}`}>
              <Icon size={24} />
            </div>
            <div>
              <div className="stat-value">{item.count}</div>
              <div className="stat-label">{item.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCard;
