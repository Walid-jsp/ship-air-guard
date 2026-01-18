// app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/actions/register";
import { Mail, Lock, User, AlertCircle, CheckCircle, ArrowRight, Loader, Home } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: [],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setMessage(null);

    const result = await registerUser(formData);

    if (result.success) {
      setMessage({
        type: "success",
        text: result.message || "Inscription réussie !",
      });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      if (result.errors) {
        setErrors(result.errors);
      } else {
        setMessage({
          type: "error",
          text: result.message || "Une erreur est survenue",
        });
      }
    }

    setLoading(false);
  };

  const getFieldError = (field: string) => errors[field]?.[0] || "";

  const formFields = [
    {
      id: "name",
      label: "Nom complet",
      type: "text",
      placeholder: "Jean Dupont",
      icon: User,
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "vous@example.com",
      icon: Mail,
    },
    {
      id: "password",
      label: "Mot de passe",
      type: "password",
      placeholder: "••••••••",
      icon: Lock,
    },
    {
      id: "confirmPassword",
      label: "Confirmer le mot de passe",
      type: "password",
      placeholder: "••••••••",
      icon: Lock,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Home Button */}
      <Link href="/" className="absolute top-8 left-8 z-20 group">
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all duration-300 backdrop-blur-sm group-hover:shadow-blue-500/20 group-hover:shadow-lg">
          <Home className="w-5 h-5" />
          <span className="text-sm font-medium">Accueil</span>
        </button>
      </Link>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4 shadow-lg">
            <User className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">Créer un compte</h1>
          <p className="text-slate-400">Rejoignez Ship Air Guard dès maintenant</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-red-500/10 border-red-500/30"
            }`}
          >
            <div className="flex items-start gap-3">
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <p
                className={`text-sm font-medium ${
                  message.type === "success" ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {message.text}
              </p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {formFields.map((field) => {
              const Icon = field.icon;
              const hasError = !!getFieldError(field.id);
              const isFocused = focusedField === field.id;

              return (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-sm font-semibold text-slate-200 mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-blue-400" />
                      {field.label}
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      value={formData[field.id as keyof typeof formData]}
                      onChange={handleChange}
                      onFocus={() => setFocusedField(field.id)}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 rounded-lg bg-white/5 border transition-all duration-300 text-white placeholder-slate-500 focus:outline-none ${
                        hasError
                          ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          : isFocused
                          ? "border-blue-500/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/10"
                          : "border-white/20 hover:border-white/30"
                      }`}
                      placeholder={field.placeholder}
                      disabled={loading}
                    />
                  </div>
                  {hasError && (
                    <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {getFieldError(field.id)}
                    </p>
                  )}
                </div>
              );
            })}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/50"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Inscription...
                </>
              ) : (
                <>
                  S'inscrire
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-500">OU</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Login Link */}
          <p className="text-center text-slate-400 text-sm">
            Vous avez déjà un compte ?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Se connecter
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          En créant un compte, vous acceptez nos conditions d'utilisation
        </p>
      </div>
    </div>
  );
}
