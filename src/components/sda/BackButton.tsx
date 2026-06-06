import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackButton({
  to,
  label = "Back",
  className = "",
}: {
  to?: string;
  label?: string;
  className?: string;
}) {
  const router = useRouter();

  function goBack() {
    if (to) {
      router.navigate({ to });
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/" });
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={goBack}
      className={`gap-1.5 -ml-2 text-muted-foreground hover:text-foreground ${className}`}
    >
      <ArrowLeft className="size-4" /> {label}
    </Button>
  );
}
