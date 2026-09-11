import React from 'react';
import { Layers, Clock, Loader2, CheckCircle2 } from 'lucide-react';

const StatsCard = ({ stats, onStatClick }) => {
  const items = [
    { label: 'Total Complaints', count: stats?.total || 0, type: 'total', icon: Layers, filter: 'All' },
    { label: 'Pending', count: stats?.pending || 0, type: 'pending', icon: Clock, filter: 'Pending' },
    { label: 'In Progress', count: stats?.inProgress || 0, type: 'inprogress', icon: Loader2, filter: 'In Progress' },
    { label: 'Resolved', count: stats?.resolved || 0, type: 'resolved', icon: CheckCircle2, filter: 'Resolved' },
  ];

  return (
    <div className="stats-grid">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div 
            key={idx} 
            className="stat-card"
            onClick={() => onStatClick && onStatClick(item.filter)}
            style={{ cursor: onStatClick ? 'pointer' : 'default' }}
            title={`Click to view ${item.label} grievances`}
          >
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
