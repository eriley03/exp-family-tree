import Link from "next/link";
import { publicAvatarUrl } from "@/lib/supabase/config";
import type { Profile } from "@/lib/types";

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function PersonCard({ profile }: { profile: Profile }) {
  const photo = publicAvatarUrl(profile.avatar_path);
  const place = [profile.city, profile.state].filter(Boolean).join(", ");

  return (
    <Link href={`/members/${profile.id}`} className="card block p-5 transition hover:-translate-y-0.5">
      <div className="flex items-center gap-4">
        {photo ? (
          // User avatars come from whichever Supabase project is connected.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" className="h-14 w-14 rounded-full object-cover" />
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage font-serif text-lg text-forest">
            {initials(profile.full_name)}
          </span>
        )}
        <div>
          <h2 className="font-serif text-2xl text-forest">{profile.full_name || "Name not added yet"}</h2>
          <p className="text-sm text-ink-soft">{place || "Location not added yet"}</p>
        </div>
      </div>
      {profile.bio ? <p className="mt-4 line-clamp-3 leading-relaxed text-ink-soft">{profile.bio}</p> : null}
    </Link>
  );
}
