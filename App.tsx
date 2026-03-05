import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import InvoiceScreen from './src/screens/InvoiceScreen';
import ReportScreen from './src/screens/ReportScreen';
import { COLORS } from './src/constants';

type TabKey = 'home' | 'invoice' | 'report';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen />;
      case 'invoice': return <InvoiceScreen />;
      case 'report': return <ReportScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.content}>
          {renderScreen()}
        </View>
        
        {/* 底部导航 */}
        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={styles.tabItem}
            onPress={() => setActiveTab('home')}
          >
            <Text style={styles.tabEmoji}>🏠</Text>
            <Text style={[styles.tabText, activeTab === 'home' && styles.tabTextActive]}>
              记账
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.tabItem}
            onPress={() => setActiveTab('invoice')}
          >
            <Text style={styles.tabEmoji}>📷</Text>
            <Text style={[styles.tabText, activeTab === 'invoice' && styles.tabTextActive]}>
              发票
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.tabItem}
            onPress={() => setActiveTab('report')}
          >
            <Text style={styles.tabEmoji}>📊</Text>
            <Text style={[styles.tabText, activeTab === 'report' && styles.tabTextActive]}>
              报表
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 20,
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  tabEmoji: {
    fontSize: 24,
  },
  tabText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
