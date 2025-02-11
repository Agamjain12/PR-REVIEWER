interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <section className="border border-gray-200 p-8 rounded-md max-w-[800px] m-auto">
      {children}
    </section>
  );
}
