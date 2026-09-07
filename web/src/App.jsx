import AppRoutes from "./app/AppRoutes.jsx";
import { ConfirmProvider } from "./shared/dialog/ConfirmDialogContext.jsx";

export default function App() {
  return (
    <ConfirmProvider>
      <AppRoutes />
    </ConfirmProvider>
  );
}
