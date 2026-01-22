import './Dashboard.css';
import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMe, logout } from '../auth/authSlice';

const getInitials = (value: string) => {
  const parts = value.trim().split(' ').filter(Boolean);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '');
  return initials.join('');
};

const formatLabel = (value: string) => {
  return value.toLowerCase().replace(/_/g, ' ');
};

export function Dashboard() {
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((state) => state.auth);

  const initials = useMemo(() => {
    if (!user?.profile.fullName) {
      return 'KU';
    }
    return getInitials(user.profile.fullName);
  }, [user?.profile.fullName]);

  if (!user) {
    return (
      <div className="dashboard-empty">
        <div className="dashboard-empty__card">
          <p className="eyebrow">Loading dashboard</p>
          <h2>Preparing your workspace</h2>
          <p>Please wait while we sync your latest data.</p>
        </div>
      </div>
    );
  }

  const role = formatLabel(user.profile.role);
  const statusLabel = formatLabel(user.status);
  const firstName = user.profile.fullName.split(' ')[0] || 'there';

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="brand">
          <span className="brand-mark">K</span>
          <div>
            <p className="brand-name">Kraken</p>
            <p className="brand-subtitle">Rewards console</p>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="ghost-button"
            onClick={() => dispatch(fetchMe())}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="solid-button" onClick={() => dispatch(logout())}>
            Log out
          </button>
        </div>
      </header>

      <section className="dashboard-hero">
        <div className="hero-copy">
          <p className="eyebrow">Welcome back</p>
          <h1>Hi, {firstName}</h1>
          <p className="hero-subtitle">
            Track your rewards, keep your progress visible, and stay aligned with your goals.
          </p>
          <div className="pill-row">
            <span className="pill">Role: {role}</span>
            <span className="pill">Status: {statusLabel}</span>
            <span className="pill">Email: {user.email}</span>
          </div>
        </div>

        <div className="hero-wallet">
          <div className="wallet-header">
            <div className="avatar">
              {user.profile.avatarUrl ? (
                <img src={user.profile.avatarUrl} alt={user.profile.fullName} />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div>
              <p className="wallet-title">Wallet snapshot</p>
              <p className="wallet-subtitle">
                {user.profile.handle ? `@${user.profile.handle}` : 'No handle set'}
              </p>
            </div>
          </div>
          <div className="wallet-grid">
            <div className="wallet-card">
              <p>Coins</p>
              <strong>{user.wallet.coinsBalance}</strong>
            </div>
            <div className="wallet-card">
              <p>Diamonds</p>
              <strong>{user.wallet.diamondsBalance}</strong>
            </div>
          </div>
          <div className="wallet-footnote">
            Keep earning by completing missions and collaborating with your squad.
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <h3>Profile highlights</h3>
          <div className="profile-list">
            <div>
              <span className="label">Full name</span>
              <p>{user.profile.fullName}</p>
            </div>
            <div>
              <span className="label">Handle</span>
              <p>{user.profile.handle ?? 'Add your handle to be discoverable.'}</p>
            </div>
            <div>
              <span className="label">Role</span>
              <p>{role}</p>
            </div>
          </div>
        </article>

        <article className="dashboard-card">
          <h3>Momentum</h3>
          <div className="progress-track">
            <div className="progress-bar">
              <span style={{ width: '72%' }} />
            </div>
            <p className="progress-caption">72% of weekly goals completed</p>
          </div>
          <div className="mini-grid">
            <div>
              <span className="label">Weekly streak</span>
              <p>4 weeks</p>
            </div>
            <div>
              <span className="label">Missions done</span>
              <p>18</p>
            </div>
          </div>
        </article>

        <article className="dashboard-card">
          <h3>Next actions</h3>
          <ul className="action-list">
            <li>Review available missions for bonus coins.</li>
            <li>Update your profile handle to unlock social badges.</li>
            <li>Send a recognition to a teammate.</li>
          </ul>
        </article>

        <article className="dashboard-card">
          <h3>Recent activity</h3>
          <div className="activity-list">
            <div>
              <span className="label">Today</span>
              <p>Login confirmed and wallet synced.</p>
            </div>
            <div>
              <span className="label">This week</span>
              <p>Keep your streak alive to unlock new rewards.</p>
            </div>
            <div>
              <span className="label">Next reward</span>
              <p>Redeem 120 coins to claim a bonus badge.</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
