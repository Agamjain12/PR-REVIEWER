import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

interface GithubSignInButtonProps {
  children: React.ReactNode
  callbackUrl: string
}
const GithubSignInButton = ({
  children,
  callbackUrl
}: GithubSignInButtonProps) => {

  const loginWithGithub = async () => {
    await signIn("github", { callbackUrl })
  }

  return (
    <Button onClick={loginWithGithub} className="w-full">
      {children}
    </Button>
  )
}

export default GithubSignInButton