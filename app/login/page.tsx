import AuthForm from '@/components/app/AuthForm';
import AppHeader from '@/components/app/AppHeader';

export const metadata = { title: 'Log in | PortsAI' };

export default function LoginPage() {
  return (
    <div className="page-shell">
      <AppHeader />
      <main className="app-main" style={{ maxWidth: 440 }}>
        <AuthForm mode="login" />
      </main>
    </div>
  );
}
