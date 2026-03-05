import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, BUDGET_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';

const STORAGE_KEY = '@finance_budgets';

// 预算类型
interface Budget {
  category: string;
  limit: number;
  spent: number;
}

const BudgetScreen: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState('');
  const [newLimit, setNewLimit] = useState('');

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const dataStr = await AsyncStorage.getItem(STORAGE_KEY);
      if (dataStr) {
        setBudgets(JSON.parse(dataStr));
      } else {
        // 默认预算
        setBudgets([
          { category: 'food', limit: 1500, spent: 0 },
          { category: 'transport', limit: 500, spent: 0 },
          { category: 'shopping', limit: 1000, spent: 0 },
          { category: 'entertainment', limit: 500, spent: 0 },
          { category: 'housing', limit: 2000, spent: 0 },
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveBudgets = async (newBudgets: Budget[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newBudgets));
      setBudgets(newBudgets);
    } catch (e) {
      console.error(e);
    }
  };

  const getCategoryInfo = (catId: string) => {
    return EXPENSE_CATEGORIES[catId as keyof typeof EXPENSE_CATEGORIES] || { name: catId, emoji: '📝' };
  };

  const getBudget = (category: string) => {
    return budgets.find(b => b.category === category);
  };

  const addBudget = () => {
    if (!editingCategory || !newLimit) return;
    
    const existing = budgets.find(b => b.category === editingCategory);
    let newBudgets: Budget[];
    
    if (existing) {
      newBudgets = budgets.map(b => 
        b.category === editingCategory 
          ? { ...b, limit: parseFloat(newLimit) }
          : b
      );
    } else {
      newBudgets = [...budgets, { category: editingCategory, limit: parseFloat(newLimit), spent: 0 }];
    }
    
    saveBudgets(newBudgets);
    setShowEditModal(false);
    setNewLimit('');
    setEditingCategory('');
  };

  const getTotalBudget = () => budgets.reduce((sum, b) => sum + b.limit, 0);
  const getTotalSpent = () => budgets.reduce((sum, b) => sum + b.spent, 0);
  const remaining = getTotalBudget() - getTotalSpent();

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 预算管理</Text>
        
        {/* 总览 */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewRow}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>预算总额</Text>
              <Text style={styles.overviewValue}>¥{getTotalBudget().toLocaleString()}</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>已花费</Text>
              <Text style={[styles.overviewValue, { color: COLORS.error }]}>¥{getTotalSpent().toLocaleString()}</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>剩余</Text>
              <Text style={[styles.overviewValue, { color: remaining >= 0 ? COLORS.success : COLORS.error }]}>
                ¥{remaining.toLocaleString()}
              </Text>
            </View>
          </View>
          
          {/* 总进度条 */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min((getTotalSpent() / getTotalBudget()) * 100, 100)}%` }]} />
          </View>
        </View>
      </View>

      {/* 预算列表 */}
      <ScrollView style={styles.list}>
        {BUDGET_CATEGORIES.map(catId => {
          const cat = getCategoryInfo(catId);
          const budget = getBudget(catId);
          const spent = budget?.spent || 0;
          const limit = budget?.limit || 0;
          const percent = limit > 0 ? (spent / limit) * 100 : 0;
          const isOver = spent > limit;
          
          return (
            <TouchableOpacity 
              key={catId} 
              style={styles.budgetItem}
              onPress={() => {
                setEditingCategory(catId);
                setNewLimit(limit.toString());
                setShowEditModal(true);
              }}
            >
              <View style={styles.budgetLeft}>
                <Text style={styles.budgetEmoji}>{cat.emoji}</Text>
                <View>
                  <Text style={styles.budgetName}>{cat.name}</Text>
                  <Text style={styles.budgetAmount}>
                    ¥{spent.toLocaleString()} / ¥{limit.toLocaleString()}
                  </Text>
                </View>
              </View>
              <View style={styles.budgetRight}>
                <Text style={[styles.budgetPercent, isOver && { color: COLORS.error }]}>
                  {percent.toFixed(0)}%
                </Text>
                <View style={styles.progressBarSmall}>
                  <View style={[styles.progressFillSmall, { width: `${Math.min(percent, 100)}%` }, isOver && { backgroundColor: COLORS.error }]} />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 提示 */}
      <View style={styles.hint}>
        <Text style={styles.hintText}>💡 点击任意分类设置预算金额</Text>
      </View>

      {/* 编辑弹窗 */}
      <Modal visible={showEditModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingCategory ? `设置 ${getCategoryInfo(editingCategory).name} 预算` : '添加预算'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="预算金额 (每月)"
              keyboardType="numeric"
              value={newLimit}
              onChangeText={setNewLimit}
            />
            
            <View style={styles.quickAmounts}>
              {[500, 1000, 2000, 5000].map(amount => (
                <TouchableOpacity
                  key={amount}
                  style={styles.quickAmount}
                  onPress={() => setNewLimit(amount.toString())}
                >
                  <Text style={styles.quickAmountText}>¥{amount}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setShowEditModal(false)}>
                <Text style={styles.cancelBtnText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.confirmBtn]} onPress={addBudget}>
                <Text style={styles.confirmBtnText}>保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 20 },
  
  overviewCard: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16, padding: 15 },
  overviewRow: { flexDirection: 'row', justifyContent: 'space-around' },
  overviewItem: { alignItems: 'center' },
  overviewLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  overviewValue: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  
  progressBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4, marginTop: 15 },
  progressFill: { height: '100%', backgroundColor: COLORS.success, borderRadius: 4 },
  
  list: { flex: 1, padding: 16 },
  budgetItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10 },
  budgetLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  budgetEmoji: { fontSize: 28, marginRight: 12 },
  budgetName: { fontSize: 15, fontWeight: '600' },
  budgetAmount: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  budgetRight: { alignItems: 'flex-end' },
  budgetPercent: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  progressBarSmall: { width: 60, height: 6, backgroundColor: COLORS.border, borderRadius: 3 },
  progressFillSmall: { height: '100%', backgroundColor: COLORS.success, borderRadius: 3 },
  
  hint: { padding: 16, alignItems: 'center' },
  hintText: { fontSize: 12, color: COLORS.textSecondary },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { backgroundColor: COLORS.background, borderRadius: 12, padding: 15, fontSize: 16, marginBottom: 15 },
  quickAmounts: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  quickAmount: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: COLORS.background, borderRadius: 20 },
  quickAmountText: { fontSize: 14, color: COLORS.primary },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalBtn: { flex: 1, padding: 15, borderRadius: 12, alignItems: 'center', marginHorizontal: 5 },
  cancelBtn: { backgroundColor: COLORS.background },
  cancelBtnText: { fontSize: 16, color: COLORS.textSecondary },
  confirmBtn: { backgroundColor: COLORS.primary },
  confirmBtnText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
});

export default BudgetScreen;
