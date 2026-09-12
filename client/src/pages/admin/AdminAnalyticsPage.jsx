import React, { useState, useEffect } from 'react';
import { getAdminAnalyticsApi } from '../../services/api';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  AlertCircle, 
  ShieldCheck, 
  Layers, 
  AlertTriangle,
  Tag,
  Calendar,
  Activity
} from 'lucide-react';

const AdminAnalyticsPage = ({ onNavigate }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminAnalyticsApi();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error('[Admin Analytics Fetch Error]', err);
      setError(err.response?.data?.message || 'Failed to calculate analytics metrics. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      {/* Title Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
              Portal Grievance Analytics & Insights
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
              Real-time computed resolution percentage, category volume, priority distribution, and submission trends
            </p>
          </div>
          <button className="btn btn-secondary" onClick={fetchAnalytics} title="Recalculate analytics">
            <RefreshCw size={14} /> Refresh Data
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', marginBottom: '2rem' }}>
          <RefreshCw size={36} className="spin" color="#059669" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.3rem' }}>
            Computing Analytics & Aggregations
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Calculating resolution speeds, category efficiency, and historical submission trends...
          </p>
        </div>
      )}

      {/* Error Alert */}
      {!loading && error && (
        <div className="alert alert-error" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={fetchAnalytics}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {!loading && analytics && (
        <>
          {/* Top Key Metrics Banner */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
            <div className="card" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)', color: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#a7f3d0' }}>
                  Resolution Efficiency Rate
                </span>
                <CheckCircle2 size={24} color="#6ee7b7" />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
                {analytics.resolutionRate}%
              </div>
              <p style={{ fontSize: '0.82rem', color: '#d1fae5', marginTop: '0.5rem' }}>
                {analytics.statusDistribution?.resolved || 0} resolved out of {analytics.totalComplaints || 0} total grievances
              </p>
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', color: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#cbd5e1' }}>
                  Avg. Resolution Time
                </span>
                <Clock size={24} color="#94a3b8" />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
                {analytics.avgResolutionDays} <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#94a3b8' }}>Days</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '0.5rem' }}>
                Average elapsed time from filing to resolution
              </p>
            </div>
          </div>

          {/* Status Breakdown Grid */}
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: '1.75rem' }}>
            <div className="stat-card">
              <div className="stat-icon total"><Layers size={22} /></div>
              <div>
                <div className="stat-value">{analytics.totalComplaints}</div>
                <div className="stat-label">Total Filed</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon pending"><Clock size={22} /></div>
              <div>
                <div className="stat-value">{analytics.statusDistribution?.pending || 0}</div>
                <div className="stat-label">Pending Action</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon inprogress"><Activity size={22} /></div>
              <div>
                <div className="stat-value">{analytics.statusDistribution?.inProgress || 0}</div>
                <div className="stat-label">In Progress</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon resolved"><CheckCircle2 size={22} /></div>
              <div>
                <div className="stat-value">{analytics.statusDistribution?.resolved || 0}</div>
                <div className="stat-label">Resolved</div>
              </div>
            </div>
          </div>

          {/* Priority Distribution Cards */}
          <div className="card" style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Priority Distribution
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Current severity levels assigned to active grievances
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'var(--danger-soft)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                <span className="priority-pill Urgent" style={{ marginBottom: '0.5rem' }}>Urgent</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--danger)' }}>
                  {analytics.priorityDistribution?.urgent || 0}
                </div>
              </div>

              <div style={{ background: 'var(--accent-soft)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                <span className="priority-pill High" style={{ marginBottom: '0.5rem' }}>High</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>
                  {analytics.priorityDistribution?.high || 0}
                </div>
              </div>

              <div style={{ background: 'var(--primary-soft)', border: '1px solid var(--border-accent)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                <span className="priority-pill Medium" style={{ marginBottom: '0.5rem' }}>Medium</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {analytics.priorityDistribution?.medium || 0}
                </div>
              </div>

              <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                <span className="priority-pill Low" style={{ marginBottom: '0.5rem' }}>Low</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--resolved-text)' }}>
                  {analytics.priorityDistribution?.low || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Category Resolution Rates */}
          <div className="card" style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Category Volume & Resolution Rates
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Resolution percentage breakdown per department category
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {(analytics.categoryAnalytics || []).map((catItem) => (
                <div key={catItem.category} style={{ background: 'var(--bg-subtle)', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        {catItem.category}
                      </strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.75rem' }}>
                        {catItem.resolved} resolved / {catItem.total} total ({catItem.pending} pending)
                      </span>
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--resolved-text)', fontSize: '0.95rem' }}>
                      {catItem.resolutionRate}% Resolved
                    </span>
                  </div>

                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill" 
                      style={{ 
                        width: `${catItem.resolutionRate}%`,
                        background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)' 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submission Trend Chart */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} color="var(--primary)" />
              14-Day Grievance Submission Trend
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Daily volume of newly submitted grievances over the last two weeks
            </p>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '180px', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
              {(analytics.submissionTrend || []).map((item, idx) => {
                const maxCount = Math.max(1, ...analytics.submissionTrend.map(t => t.count));
                const barHeight = item.count > 0 ? Math.max(20, Math.round((item.count / maxCount) * 140)) : 6;
                return (
                  <div key={idx} style={{ flex: 1, minWidth: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: item.count > 0 ? 'var(--primary)' : 'var(--text-subtle)' }}>
                      {item.count}
                    </span>
                    <div 
                      style={{ 
                        width: '100%', 
                        maxWidth: '28px', 
                        height: `${barHeight}px`, 
                        background: item.count > 0 ? 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)' : 'var(--border)', 
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.3s ease'
                      }}
                      title={`${item.date}: ${item.count} complaints`}
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', marginTop: '0.2rem' }}>
                      {item.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnalyticsPage;
