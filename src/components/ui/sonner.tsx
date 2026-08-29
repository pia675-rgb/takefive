import { Toaster as Sonner } from "sonner";

function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "bg-card text-foreground border-border shadow-[var(--shadow-border)]",
          title: "text-foreground",
          description: "text-muted-foreground",
        },
      }}
    />
  );
}

export { Toaster };
