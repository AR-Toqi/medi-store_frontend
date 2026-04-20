import { Metadata } from "next";
import { ProfileUpdateView } from "@/components/profile/profile-update-view";

export const metadata: Metadata = {
  title: "Update Profile | MediStore",
  description: "Personalize your MediStore identity and update your profile information.",
};

export default function UpdateProfilePage() {
  return <ProfileUpdateView />;
}
