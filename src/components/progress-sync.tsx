import { useEffect } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  activateSave,
  flushProgress,
  retryProgress,
  setProgressTransport,
} from "@/lib/progress-store";
import { getProgress, putProgress } from "@/lib/learning";

setProgressTransport({ get: () => getProgress(), put: (data) => putProgress({ data }) });

export function ProgressSync() {
  const { user, isPending } = useCurrentUserState();
  useEffect(() => {
    if (!isPending) void activateSave(user?.id ?? null);
  }, [user?.id, isPending]);
  useEffect(() => {
    const online = () => {
      void retryProgress();
    };
    const visibility = () => {
      if (document.visibilityState === "hidden") void flushProgress();
    };
    window.addEventListener("online", online);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("online", online);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return null;
}
