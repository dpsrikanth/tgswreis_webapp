import AppRoutes from './routes.jsx';
import { SidebarProvider } from './components/common/SidebarProvider.jsx';

function App() {
   return (
    <SidebarProvider>
        <AppRoutes />
    </SidebarProvider>
  );
}

export default App;
