import { AuthForm } from "@/components/AuthForm";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-[1512px] flex-1 items-start justify-center px-4 py-12 sm:px-6 lg:px-30 lg:py-16">
      <AuthForm mode="login" oauthError={params.error ?? null} />
    </main>
  );
}
