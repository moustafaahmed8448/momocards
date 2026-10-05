"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getRepo, SlugTakenError } from "@/lib/repo";
import { slugify } from "@/lib/invitation";
import { isThemeId } from "@/lib/themes";
import type { ClientDraft } from "@/lib/types";

export interface FormState {
  error?: string;
  ok?: boolean;
}

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

function num(fd: FormData, k: string, fallback = 0): number {
  const parsed = Number.parseFloat(str(fd, k));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildDraft(fd: FormData): ClientDraft {
  const theme = str(fd, "theme");
  return {
    clientName: str(fd, "clientName") || "Untitled invitation",
    slug: slugify(str(fd, "slug") || str(fd, "clientName")),
    theme: isThemeId(theme) ? theme : "royal",
    hosts: {
      ar: str(fd, "hosts.ar"),
      en: str(fd, "hosts.en"),
      monogram: str(fd, "hosts.monogram").slice(0, 2) || "M",
    },
    event: { ar: str(fd, "event.ar"), en: str(fd, "event.en") },
    body: { ar: str(fd, "body.ar"), en: str(fd, "body.en") },
    date: {
      iso: str(fd, "date.iso"),
      ar: str(fd, "date.ar"),
      en: str(fd, "date.en"),
    },
    time: { ar: str(fd, "time.ar"), en: str(fd, "time.en") },
    venue: { ar: str(fd, "venue.ar"), en: str(fd, "venue.en") },
    location: { lat: num(fd, "location.lat"), lng: num(fd, "location.lng") },
    pass: {
      code: str(fd, "pass.code"),
      url: str(fd, "pass.url"),
      hint: {
        ar: str(fd, "pass.hint.ar"),
        en: str(fd, "pass.hint.en"),
      },
    },
    brand: { ar: str(fd, "brand.ar"), en: str(fd, "brand.en") },
  };
}

/** Create when `id` is absent, update when it is present. */
export async function saveClient(
  _prev: FormState,
  fd: FormData,
): Promise<FormState> {
  const id = str(fd, "id");
  const draft = buildDraft(fd);

  try {
    const repo = getRepo();
    if (id) {
      const updated = await repo.update(id, draft);
      if (!updated) return { error: "That invitation no longer exists." };
    } else {
      await repo.create(draft);
    }
  } catch (err) {
    if (err instanceof SlugTakenError) return { error: err.message };
    console.error("[momocards] save failed", err);
    return {
      error:
        err instanceof Error
          ? err.message
          : "Could not save. Check the server logs.",
    };
  }

  revalidatePath("/");
  revalidatePath("/i");
  redirect("/");
}

export async function deleteClient(fd: FormData): Promise<void> {
  const id = str(fd, "id");
  if (id) await getRepo().remove(id);
  revalidatePath("/");
  redirect("/");
}

export async function duplicateClient(fd: FormData): Promise<void> {
  const id = str(fd, "id");
  const repo = getRepo();
  const source = id ? await repo.getById(id) : null;

  if (source) {
    const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = source;
    // `-copy` suffix, bumped until the slug is free.
    let slug = `${rest.slug}-copy`;
    let n = 2;
    while (await repo.getBySlug(slug)) slug = `${rest.slug}-copy-${n++}`;
    await repo.create({ ...rest, clientName: `${rest.clientName} (copy)`, slug });
  }

  revalidatePath("/");
  redirect("/");
}