import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import InvoiceScreen from './src/screens/InvoiceScreen';
import ReportScreen from './src/screens/ReportScreen';
import AssetScreen from './src/screens/AssetScreen';
import BudgetScreen from './src/screens/BudgetScreen';
import { COLORS } from './src/constants';

type TabKey = 'home' | 'invoice' | 'report' | 'asset' | 'budget';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen />;
      case 'invoice': return <InvoiceScreen />;
      case 'report': return <ReportScreen />;
      case 'asset': return <AssetScreen />;
      case 'budget': return <BudgetScreen />;
      default: return <HomeScreen />;
    }
  };

  const tabs = [
    { key: 'home', emoji: '🏠', label: '记账' },
    { key: 'invoice', emoji: '📷', label: '发票' },
    { key: 'report', emoji: '📊', label: '报表' },
    { key: 'asset', emoji: '🏦', label: '资产' },
    { key: 'budget', emoji: '📋', label: '预算' },
  ] as const;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.content}>
          {renderScreen()}
        </View>
        
        {/* 底部导航 */}
        <View style={styles.tabBar}>
          {tabs.map(tab => (
            <TouchableOpacity 
              key={tab.key}
              style={styles.tabItem}
              onPress={() => setActiveTab(tab.key as TabKey)}
            >
              <Text style={styles.tabEmoji}>{tab.emoji}</Text>
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
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
    fontSize: 22,
  },
  tabText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
