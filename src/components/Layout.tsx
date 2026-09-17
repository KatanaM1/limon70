import { Link, useLocation } from 'react-router-dom';
import { isAdmin } from '../lib/telegram';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const admin = isAdmin();

  const tabs = [
    { to: '/', label: 'Каталог', icon: '🛍' },
    ...(admin ? [{ to: '/admin', label: 'Админка', icon: '⚙️' }] : []),
  ];

  return (
    <div className="app">
      <header className="header">
        <h1>🍋 Limon70</h1>
      </header>
      <main className="main">{children}</main>
      <nav className="tabbar">
        {tabs.map((t) => (
          <Link key={t.to} to={t.to} className={pathname === t.to ? 'active' : ''}>
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}