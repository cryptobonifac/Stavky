import AuthPageLayout from '@/components/auth/AuthPageLayout'
import LoginForm from '@/components/auth/LoginForm'

export const metadata = {
  title: 'Login | Stavky',
}

export default function LoginPage() {
  return (
    <AuthPageLayout
      title="Welcome back"
      subtitle="Sign in to manage tips, subscriptions, and results."
      footer={{
        prompt: "Don't have an account?",
        link: { href: '/signup', label: 'Create one' },
      }}
    >
      <LoginForm />
    </AuthPageLayout>
  )
}


