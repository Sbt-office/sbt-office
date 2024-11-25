import { useToastStore } from "../store/toastStore";

const Toast = () => {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded shadow-lg transition-transform transform ${
            toast.type === "success"
              ? "bg-green-500 text-white translate-x-0 opacity-100 animate-slideIn"
              : "bg-red-500 text-white translate-x-0 opacity-100 animate-slideIn"
          }`}
          role="alert"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;
