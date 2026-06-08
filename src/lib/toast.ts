// Tiny dependency-free toast store. Call `toast.success(...)` / `toast.error(...)`
// anywhere; the global <Toaster /> renders them.

export type ToastType = "success" | "error" | "info";
export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

let items: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<(items: ToastItem[]) => void>();

function emit() {
  for (const l of listeners) l(items);
}

function push(type: ToastType, message: string) {
  const id = nextId++;
  items = [...items, { id, type, message }];
  emit();
  setTimeout(() => dismiss(id), 5000);
  return id;
}

export function dismiss(id: number) {
  items = items.filter((t) => t.id !== id);
  emit();
}

export function subscribeToasts(fn: (items: ToastItem[]) => void) {
  listeners.add(fn);
  fn(items);
  return () => listeners.delete(fn);
}

export const toast = {
  success: (m: string) => push("success", m),
  error: (m: string) => push("error", m),
  info: (m: string) => push("info", m),
};
