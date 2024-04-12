import SignInForm from "@/components/form/signin-form";
import { getUserSession } from "@/lib/actions/auth.actions";
import { redirect } from "next/navigation";

interface SignInPageProps {
  searchParams: {
    callbackUrl: string;
  };
}
const SignInPage = async ({
  searchParams: { callbackUrl },
}: SignInPageProps) => {
  const { session } = await getUserSession();
  console.log(session?.user);
  if (session) {
    redirect("/");
  }
  return (
    <div className="w-full">
      <SignInForm callbackUrl={callbackUrl || "/"} />
    </div>
  );
};

export default SignInPage;
