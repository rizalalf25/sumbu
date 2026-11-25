import { createFileRoute } from "@tanstack/react-router";
import { ACCOUNTS_ENABLED } from "@/lib/accounts";
import { getAuth } from "@/lib/auth/local.server";

// Tanpa pengaturan akun (lihat src/lib/accounts.ts), auth tidak dijalankan sama sekali.
const accountsOff = () =>
  Response.json({ message: "Akun belum diaktifkan di situs ini." }, { status: 404 });

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => (ACCOUNTS_ENABLED ? getAuth().handler(request) : accountsOff()),
      POST: ({ request }) => (ACCOUNTS_ENABLED ? getAuth().handler(request) : accountsOff()),
    },
  },
});
