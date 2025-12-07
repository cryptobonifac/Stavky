import AuthPageLayout from '@/components/auth/AuthPageLayout'
import SignupForm from '@/components/auth/SignupForm'

// Mark as dynamic to prevent prerendering issues
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Create account | Stavky',
}

export default function SignupPage() {
  return (
    <AuthPageLayout
      title="Create your Stavky account"
      subtitle="Get access to premium betting tips and management tools."
      footer={{
        prompt: 'Already have an account?',
        link: { href: '/login', label: 'Sign in' },
      }}
    >
      <SignupForm />
    </AuthPageLayout>
  )
}


