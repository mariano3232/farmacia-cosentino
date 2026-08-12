import { AuthForm } from "@/components/AuthForm";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1512px] flex-1 items-start justify-center px-4 py-12 sm:px-6 lg:px-30 lg:py-16">
      <AuthForm mode="register" />
    </main>
  );
}
