import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MatchList from '../screens/MatchList';
import AdminHome from '../app/(admin)/AdminHome';
import AdminPanel from '../screens/AdminSuperPanel';
import BancaPanel from '../screens/BancaPanel';
import CambistaPanel from '../screens/CambistaPanel';
import ClientHome from '../app/(cliente)/ClientHome';

import { useAuth } from '../context/AuthContext';
import { getInitialRouteForRole } from './routeUtils';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function PlaceholderScreen({ title }: { title: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#0D1117', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#FFF', fontSize: 18 }}>{title}</Text>
    </View>
  );
}

// Drawer Stacks por Cargo
function AdminDrawer() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false, drawerStyle: { backgroundColor: '#0D1117' } }}>
      <Drawer.Screen name="AdminHome" component={AdminHome} options={{ drawerLabel: 'Admin' }} />
      <Drawer.Screen name="AdminPanel" component={AdminPanel} options={{ drawerLabel: 'Painel Admin' }} />
    </Drawer.Navigator>
  );
}

function BancaDrawer() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false, drawerStyle: { backgroundColor: '#0D1117' } }}>
      <Drawer.Screen name="BancaHome" component={BancaPanel} options={{ drawerLabel: 'Dashboard Banca' }} />
      <Drawer.Screen name="BancaReports" component={() => <PlaceholderScreen title="Relatórios" />} />
    </Drawer.Navigator>
  );
}

function CambistaDrawer() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false, drawerStyle: { backgroundColor: '#0D1117' } }}>
      <Drawer.Screen name="CambistaHome" component={CambistaPanel} options={{ drawerLabel: 'Dashboard Cambista' }} />
    </Drawer.Navigator>
  );
}

function ClientDrawer() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false, drawerStyle: { backgroundColor: '#0D1117' } }}>
      <Drawer.Screen name="ClientHome" component={ClientHome} options={{ drawerLabel: 'Jogos' }} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const { authenticated, role } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!authenticated ? (
        // Auth Stack
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="MatchDemo" component={MatchList} />
        </Stack.Group>
      ) : (
        // App Stack
        <Stack.Group>
          {role === 'admin' && <Stack.Screen name="Main" component={AdminDrawer} />}
          {role === 'banca' && <Stack.Screen name="Main" component={BancaDrawer} />}
          {role === 'cambista' && <Stack.Screen name="Main" component={CambistaDrawer} />}
          {role === 'client' && <Stack.Screen name="Main" component={ClientDrawer} />}
          {/* Fallback caso role seja indefinido */}
          {!role && <Stack.Screen name="Main" component={CambistaDrawer} />}
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
