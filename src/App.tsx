import { AppRoutes } from "@/routes/AppRoutes";
import { Toast } from "@/shared/components/feedback/Toast";
import { useUIStore } from "@/store/ui.store";
import { useEffect } from "react";

function App() {
  const { toast, hideToast } = useUIStore();

  useEffect(() => {
    if (toast.isVisible) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.isVisible, hideToast]);

  return (
    <div className="antialiased">
      <AppRoutes />
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={hideToast} 
      />
    </div>
  );
}

export default App;
