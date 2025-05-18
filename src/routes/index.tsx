import { NavigationContainer } from "@react-navigation/native";
import StackRoutes from "./stack.routes";
import { AuthProvider } from "../contexts/AuthContext";
import { DataProvider } from "../contexts/DataContext";

export default function Routes() {
  return (
    <AuthProvider>
      <DataProvider>
        <NavigationContainer>
          <StackRoutes />
        </NavigationContainer>
      </DataProvider>
    </AuthProvider>
  );
}
