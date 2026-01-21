// app/dashboard/profile/page.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Mail, User, LogOut, AlertCircle, CheckCircle, Loader, Save, X } from "lucide-react";
import Link from "next/link";
import { updateProfile } from "@/actions/updateProfile";
import Navbar from "@/app/components/Navbar";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Synchroniser les champs avec la session
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 animate-spin text-blue-400" />
          <p className="text-slate-300">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

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

    // CORRECTION ICI : Utilisation de 'as any' pour contourner l'erreur TypeScript sur l'ID
    const userId = (session?.user as any)?.id;
    const result = await updateProfile(userId, formData);

    if (result.success) {
      setMessage({
        type: "success",
        text: result.message || "Profil mis à jour avec succès",
      });
      setIsEditing(false);
      setTimeout(() => setMessage(null), 3000);
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

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  const getFieldError = (field: string) => errors[field]?.[0] || "";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">Mon Profil</h1>
            <p className="text-slate-400">Gérez vos informations personnelles</p>
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

          {/* Profile Card */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-12">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{session?.user?.name || "Utilisateur"}</h2>
                  <p className="text-blue-100 text-sm mt-1">{session?.user?.email}</p>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Edit Toggle */}
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full px-4 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 font-medium transition-all duration-300"
                  >
                    Modifier mon profil
                  </button>
                )}

                {isEditing && (
                  <>
                    {/* Nom */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-slate-200 mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-400" />
                          Nom complet
                        </div>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 rounded-lg bg-white/5 border transition-all duration-300 text-white placeholder-slate-500 focus:outline-none ${
                          getFieldError("name")
                            ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : focusedField === "name"
                            ? "border-blue-500/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/10"
                            : "border-white/20 hover:border-white/30"
                        }`}
                      />
                      {getFieldError("name") && (
                        <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {getFieldError("name")}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-slate-200 mb-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-400" />
                          Email
                        </div>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 rounded-lg bg-white/5 border transition-all duration-300 text-white placeholder-slate-500 focus:outline-none ${
                          getFieldError("email")
                            ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : focusedField === "email"
                            ? "border-blue-500/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/10"
                            : "border-white/20 hover:border-white/30"
                        }`}
                      />
                      {getFieldError("email") && (
                        <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {getFieldError("email")}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                      >
                        {loading ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Mise à jour...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Enregistrer
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: session?.user?.name || "",
                            email: session?.user?.email || "",
                          });
                          setErrors({});
                        }}
                        className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <X className="w-5 h-5" />
                        Annuler
                      </button>
                    </div>
                  </>
                )}

                {/* Account Info */}
                {!isEditing && (
                    <div className="bg-slate-700/30 p-5 rounded-xl border border-slate-700">
                      <h3 className="text-sm font-semibold text-white mb-4">Informations du compte</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">ID Utilisateur:</span>
                          <span className="text-slate-200 font-mono text-xs bg-white/5 px-3 py-1 rounded">
                            {/* CORRECTION ICI */}
                            {(session?.user as any)?.id}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Plan d'abonnement:</span>
                          <span className="text-slate-200 font-medium">
                            {/* CORRECTIONS ICI */}
                            {(session?.user as any)?.subscriptionPlan === "free" && "Gratuit"}
                            {(session?.user as any)?.subscriptionPlan === "starter" && "Starter"}
                            {(session?.user as any)?.subscriptionPlan === "pro" && "Pro"}
                            {(session?.user as any)?.subscriptionPlan === "enterprise" && "Enterprise"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Statut:</span>
                          <span className="text-emerald-400 font-medium flex items-center gap-1">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                            Actif
                          </span>
                        </div>
                      </div>
                    </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}