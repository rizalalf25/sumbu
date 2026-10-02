import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { LabView } from "@/components/lab-view";
import { Shell } from "@/components/shell";
import type { SceneKind } from "@/components/scenes";

export const Route = createFileRoute("/studio")({ component: Studio });

const LABS: { id: SceneKind; title: string; topic: string; line: string }[] = [
  { id: "projectile", title: "Parabola", topic: "parabola", line: "Pecah gerak. Waktu datang dari sumbu vertikal." },
  { id: "pendulum", title: "Bandul", topic: "gelombang", line: "Panjang mengubah periode. Massa tidak." },
  { id: "wave", title: "Gelombang", topic: "gelombang", line: "Amplitudo bukan cepat rambat." },
  { id: "vector", title: "Vektor", topic: "vektor", line: "Jumlahkan komponen, baru ukur panjang." },
  { id: "charges", title: "Muatan", topic: "listrik", line: "Medan keluar dari positif, masuk ke negatif." },
  { id: "surface", title: "Permukaan", topic: "parsial", line: "Satu arah dibekukan, arah lain bergerak." },
  { id: "field", title: "Div dan curl", topic: "medan", line: "Sumber menyebar. Pusaran mengelilingi." },
];

function Studio() {
  const [id, setId] = useState<SceneKind>("projectile");
  const current = LABS.find((lab) => lab.id === id) ?? LABS[0];
  return (
    <Shell wide>
      <p className="text-sm font-semibold text-copper">Studio</p>
      <h1 className="mt-1 text-4xl md:text-5xl">Gambar yang bisa diputar</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Tujuh ruang tiga dimensi. Putar pandangan, ubah satu penggeser, hubungkan ke materinya. Tidak perlu menyelesaikan semuanya hari ini.
      </p>
      <div className="mt-6 grid gap-6 md:grid-cols-12">
        <div className="grid content-start gap-2 md:col-span-4">
          {LABS.map((lab) => (
            <button
              key={lab.id}
              type="button"
              onClick={() => setId(lab.id)}
              className={`card px-4 py-3 text-left ${lab.id === id ? "border-copper" : ""}`}
            >
              <span className="block font-medium">{lab.title}</span>
              <span className="block text-sm text-muted">{lab.line}</span>
            </button>
          ))}
        </div>
        <div className="md:col-span-8">
          <LabView key={current.id} kind={current.id} />
          <Link to="/belajar/$topicId" params={{ topicId: current.topic }} className="btn mt-4">
            Buka materi {current.title.toLowerCase()}
          </Link>
        </div>
      </div>
    </Shell>
  );
}
