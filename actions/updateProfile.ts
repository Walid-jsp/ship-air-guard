// actions/updateProfile.ts
"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
});

type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  try {
    // Validation
    const parsed = updateProfileSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const { name, email } = parsed.data;

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email !== (await prisma.user.findUnique({ where: { id: userId } }))?.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return {
          success: false,
          errors: {
            email: ["Cet email est déjà utilisé"],
          },
        };
      }
    }

    // Mettre à jour l'utilisateur
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
      },
    });

    return {
      success: true,
      message: "Profil mis à jour avec succès",
      user,
    };
  } catch (error) {
    console.error("Update profile error:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la mise à jour du profil",
    };
  }
}
