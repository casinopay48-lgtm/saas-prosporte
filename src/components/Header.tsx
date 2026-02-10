/**
 * Header Component - Header Dinâmico por Tenant
 * 
 * Componente de header reutilizável que se adapta automaticamente
 * ao tema e branding do tenant ativo.
 */

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Menu, Bell, User } from 'lucide-react-native';

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
  showMenu?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export default function Header({
  title,
  showLogo = true,
  showMenu = true,
  showNotifications = false,
  showProfile = false,
  onMenuPress,
  onNotificationPress,
  onProfilePress,
}: HeaderProps) {
  const { colors, assets, tenantName } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Left Section: Menu Icon */}
      {showMenu && (
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={onMenuPress}
        >
          <Menu size={24} color={colors.text} />
        </TouchableOpacity>
      )}

      {/* Center Section: Logo + Title */}
      <View style={styles.centerSection}>
        {showLogo && assets.logoSmall && (
          <Image
            source={{ uri: assets.logoSmall }}
            style={styles.logoSmall}
            resizeMode="contain"
          />
        )}
        <Text style={[styles.title, { color: colors.text }]}>
          {title || tenantName}
        </Text>
      </View>

      {/* Right Section: Notifications + Profile */}
      <View style={styles.rightSection}>
        {showNotifications && (
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={onNotificationPress}
          >
            <Bell size={22} color={colors.text} />
            {/* Badge de notificação */}
            <View style={[styles.badge, { backgroundColor: colors.error }]}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        )}

        {showProfile && (
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={onProfilePress}
          >
            <User size={22} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  iconButton: {
    padding: 8,
    position: 'relative',
  },
  centerSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSmall: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});