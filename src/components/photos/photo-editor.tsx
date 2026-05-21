"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Plus, Trash2, X } from "lucide-react";
import {
  formatEventDateLabel,
  fromDatetimeLocalValue,
  personInitials,
  tagPillVariant,
} from "@/lib/photos/format";
import type { PhotoDetail } from "@/lib/photos/get-photo";
import { photoFormSchema, type PhotoFormValues } from "@/lib/photos/schema";
import {
  searchPeople,
  searchTags,
  softDeletePhoto,
  updatePhoto,
} from "@/lib/photos/update-actions";

type SaveStatus = "idle" | "saving" | "saved" | "error";

type PhotoEditorProps = {
  photo: PhotoDetail;
};

export function PhotoEditor({ photo }: PhotoEditorProps) {
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [peopleQuery, setPeopleQuery] = useState("");
  const [peopleSuggestions, setPeopleSuggestions] = useState<
    { id: string; name: string; relationship: string | null }[]
  >([]);
  const [tagQuery, setTagQuery] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState<
    { id: string; name: string }[]
  >([]);
  const [deleting, setDeleting] = useState(false);
  const snapshotRef = useRef(JSON.stringify(photo.formDefaults));

  const form = useForm<PhotoFormValues>({
    resolver: zodResolver(photoFormSchema),
    defaultValues: photo.formDefaults,
    mode: "onChange",
  });

  const { register, control, setValue, getValues } = form;
  const watched = useWatch({ control });
  const eventDate = useWatch({ control, name: "eventDate" });
  const people = useWatch({ control, name: "people" }) ?? [];
  const tags = useWatch({ control, name: "tags" }) ?? [];

  const persist = useCallback(async () => {
    const payload = getValues();
    const serialized = JSON.stringify(payload);
    if (serialized === snapshotRef.current) return;

    setSaveStatus("saving");
    setSaveError(null);

    const result = await updatePhoto(photo.id, payload);

    if (result.ok) {
      snapshotRef.current = serialized;
      setSaveStatus("saved");
      router.refresh();
    } else {
      setSaveStatus("error");
      setSaveError(result.error);
    }
  }, [getValues, photo.id, router]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void persist();
    }, 800);
    return () => window.clearTimeout(timer);
  }, [watched, persist]);

  useEffect(() => {
    if (saveStatus !== "saved") return;
    const timer = window.setTimeout(() => setSaveStatus("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [saveStatus]);

  useEffect(() => {
    if (peopleQuery.trim().length < 1) {
      setPeopleSuggestions([]);
      return;
    }
    const timer = window.setTimeout(() => {
      void searchPeople(peopleQuery).then(setPeopleSuggestions);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [peopleQuery]);

  useEffect(() => {
    if (tagQuery.trim().length < 1) {
      setTagSuggestions([]);
      return;
    }
    const timer = window.setTimeout(() => {
      void searchTags(tagQuery).then(setTagSuggestions);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [tagQuery]);

  const addPerson = (person: {
    id?: string;
    name: string;
    relationship?: string;
  }) => {
    const name = person.name.trim();
    if (!name) return;
    const exists = people.some(
      (p) => p.name.toLowerCase() === name.toLowerCase(),
    );
    if (exists) return;
    setValue("people", [...people, { id: person.id, name, relationship: person.relationship }], {
      shouldDirty: true,
    });
    setPeopleQuery("");
    setPeopleSuggestions([]);
  };

  const removePerson = (index: number) => {
    setValue(
      "people",
      people.filter((_, i) => i !== index),
      { shouldDirty: true },
    );
  };

  const addTag = (name: string) => {
    const normalized = name.trim().toLowerCase();
    if (!normalized || tags.includes(normalized)) return;
    setValue("tags", [...tags, normalized], { shouldDirty: true });
    setTagQuery("");
    setTagSuggestions([]);
  };

  const removeTag = (index: number) => {
    setValue(
      "tags",
      tags.filter((_, i) => i !== index),
      { shouldDirty: true },
    );
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Mover esta foto para a lixeira? Você poderá restaurá-la depois.",
      )
    ) {
      return;
    }
    setDeleting(true);
    await softDeletePhoto(photo.id);
  };

  const datePreview =
    formatEventDateLabel(fromDatetimeLocalValue(eventDate)) ??
    photo.eventDateLabel;

  return (
    <div className="screen-body photo-screen-body">
      <div className="photo-single">
        <div className="ps-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.imageUrl} alt={getValues("title") || "Foto"} />
        </div>

        <aside className="ps-panel">
          <div className="ps-panel-top">
            <div>
              {datePreview ? (
                <p className="ps-date">{datePreview}</p>
              ) : (
                <p className="ps-date ps-date-muted">Sem data</p>
              )}
              <div className="field" style={{ marginTop: "var(--space-3)" }}>
                <label className="field-label" htmlFor="eventDate">
                  Data do evento
                </label>
                <input
                  id="eventDate"
                  type="datetime-local"
                  {...register("eventDate")}
                />
              </div>
            </div>
            <p className={`save-status status-${saveStatus}`} aria-live="polite">
              {saveStatus === "saving" && "Salvando…"}
              {saveStatus === "saved" && "Salvo"}
              {saveStatus === "error" && (saveError ?? "Erro ao salvar")}
              {saveStatus === "idle" && "\u00a0"}
            </p>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="title">
              Título
            </label>
            <input
              id="title"
              type="text"
              placeholder="Dê um nome à memória"
              {...register("title")}
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="location">
              Local
            </label>
            <div className="field-with-icon">
              <MapPin size={16} strokeWidth={1.75} aria-hidden />
              <input
                id="location"
                type="text"
                placeholder="Cidade, lugar ou endereço"
                {...register("location")}
              />
            </div>
          </div>

          <div className="ps-block">
            <p className="ps-block-label">História</p>
            <div className="field field-story">
              <textarea
                id="description"
                rows={6}
                placeholder="Conte o que aconteceu neste dia…"
                className="ps-story-input"
                {...register("description")}
              />
            </div>
          </div>

          <div className="ps-block">
            <p className="ps-block-label">Pessoas marcadas</p>
            <div className="people-row">
              {people.map((person, index) => (
                <span key={`${person.id ?? person.name}-${index}`} className="people-chip">
                  <span className="avatar sm blue">{personInitials(person.name)}</span>
                  {person.name}
                  <button
                    type="button"
                    className="chip-remove"
                    aria-label={`Remover ${person.name}`}
                    onClick={() => removePerson(index)}
                  >
                    <X size={12} strokeWidth={2} />
                  </button>
                </span>
              ))}
            </div>
            <div className="combobox-wrap">
              <input
                type="text"
                className="combobox-input"
                placeholder="Buscar ou criar pessoa…"
                value={peopleQuery}
                onChange={(e) => setPeopleQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addPerson({ name: peopleQuery });
                  }
                }}
              />
              {peopleSuggestions.length > 0 && (
                <ul className="combobox-list" role="listbox">
                  {peopleSuggestions.map((suggestion) => (
                    <li key={suggestion.id}>
                      <button
                        type="button"
                        className="combobox-option"
                        onClick={() =>
                          addPerson({
                            id: suggestion.id,
                            name: suggestion.name,
                            relationship: suggestion.relationship ?? undefined,
                          })
                        }
                      >
                        <span>{suggestion.name}</span>
                        {suggestion.relationship ? (
                          <span className="combobox-meta">
                            {suggestion.relationship}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="button"
              className="chip dashed btn-sm"
              onClick={() => addPerson({ name: peopleQuery })}
              disabled={!peopleQuery.trim()}
            >
              <Plus size={10} strokeWidth={2} />
              Adicionar
            </button>
          </div>

          <div className="ps-block">
            <p className="ps-block-label">Tags</p>
            <div className="people-row">
              {tags.map((tag, index) => (
                <span
                  key={tag}
                  className={`tag-pill ${tagPillVariant(tag)}`}
                >
                  {tag}
                  <button
                    type="button"
                    className="chip-remove tag-remove"
                    aria-label={`Remover tag ${tag}`}
                    onClick={() => removeTag(index)}
                  >
                    <X size={12} strokeWidth={2} />
                  </button>
                </span>
              ))}
            </div>
            <div className="combobox-wrap">
              <input
                type="text"
                className="combobox-input"
                placeholder="Nova tag…"
                value={tagQuery}
                onChange={(e) => setTagQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag(tagQuery);
                  }
                }}
              />
              {tagSuggestions.length > 0 && (
                <ul className="combobox-list" role="listbox">
                  {tagSuggestions.map((suggestion) => (
                    <li key={suggestion.id}>
                      <button
                        type="button"
                        className="combobox-option"
                        onClick={() => addTag(suggestion.name)}
                      >
                        {suggestion.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="ps-block ps-actions">
            <button
              type="button"
              className="btn btn-danger btn-sm"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => void handleDelete()}
              disabled={deleting}
            >
              <Trash2 size={14} strokeWidth={1.75} />
              {deleting ? "Movendo…" : "Mover pra lixeira"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
