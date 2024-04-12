import { getUserSession, signUpWithCredentials } from "@/lib/actions/auth.actions"
import SignUpForm from "@/components/form/signup-form"
import { redirect } from "next/navigation"

interface SignUpPageProps {
  searchParams: {
    callbackUrl: string
  }
}

const SignUpPage = async ({
  searchParams: { callbackUrl }
}: SignUpPageProps) => {
  const { session } = await getUserSession()
  if(session) {
    redirect("/");
  }
  return (
    <div className="w-full">
      <SignUpForm
        callbackUrl={callbackUrl || "/"}
        signUpWithCredentials={signUpWithCredentials}
      />
    </div>
  )
}

export default SignUpPage