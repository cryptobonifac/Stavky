import AuthPageLayout from '@/components/auth/AuthPageLayout'
import LoginForm from '@/components/auth/LoginForm'

// Mark as dynamic because LoginForm uses useSearchParams()
export const dynamic = 'force-dynamic'

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


