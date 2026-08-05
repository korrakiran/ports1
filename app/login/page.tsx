import AuthForm from '@/components/app/AuthForm';
import AppHeader from '@/components/app/AppHeader';

export const metadata = {
  title: 'Log in | PortsAI',
  description: 'Log in to PortsAI to analyze your products and discover the best international markets.'
};

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
