import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/peta")({
  component: () => <Outlet />,
});
