import AuthForm from '@/components/app/AuthForm';
import AppHeader from '@/components/app/AppHeader';

export const metadata = {
  title: 'Sign up | PortsAI',
  description: 'Create a PortsAI account to analyze products, compute trade margins, and access export readiness guidance.'
};

export default function SignupPage() {
  return (
    <div className="page-shell">
      <AppHeader />
      <main className="app-main" style={{ maxWidth: 440 }}>
        <AuthForm mode="signup" />
      </main>
    </div>
  );
}
