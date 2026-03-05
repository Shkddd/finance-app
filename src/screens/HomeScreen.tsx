import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import { COLORS, CATEGORIES } from '../constants';

// 类型
interface Transaction {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string;
  type: 'income' | 'expense';
}

const HomeScreen: React.FC = () => {
  const [balance, setBalance] = useState(10000);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', amount: 5000, category: 'salary', note: '月工资', date: '2026-03-01', type: 'income' },
    { id: '2', amount: 128, category: 'food', note: '午餐', date: '2026-03-02', type: 'expense' },
    { id: '3', amount: 45, category: 'transport', note: '地铁', date: '2026-03-02', type: 'expense' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAmount, setNewAmount] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newCategory, setNewCategory] = useState('food');
  const [newType, setNewType] = useState<'income' | 'expense'>('expense');

  // 计算
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  // 添加记账
  const addTransaction = () => {
    if (!newAmount) return;
    
    const transaction: Transaction = {
      id: Date.now().toString(),
      amount: parseFloat(newAmount),
      category: newCategory,
      note: newNote,
      date: new Date().toISOString().split('T')[0],
      type: newType,
    };
    
    setTransactions([transaction, ...transactions]);
    setBalance(newType === 'income' 
      ? balance + parseFloat(newAmount) 
      : balance - parseFloat(newAmount)
    );
    
    setNewAmount('');
    setNewNote('');
    setShowAddModal(false);
  };

  // 获取分类信息
  const getCategoryInfo = (catId: string) => {
    return CATEGORIES[catId as keyof typeof CATEGORIES] || { name: catId, emoji: '📝' };
  };

  return (
    <View style={styles.container}>
      {/* 顶部统计 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💰 财务管家</Text>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>总资产</Text>
          <Text style={styles.balanceAmount}>¥{balance.toLocaleString()}</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>收入</Text>
            <Text style={[styles.statValue, { color: COLORS.success }]}>
              +¥{income.toLocaleString()}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>支出</Text>
            <Text style={[styles.statValue, { color: COLORS.error }]}>
              -¥{expense.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* 快捷功能 */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: COLORS.success }]}
          onPress={() => { setNewType('income'); setShowAddModal(true); }}
        >
          <Text style={styles.actionEmoji}>💵</Text>
          <Text style={styles.actionText}>记收入</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: COLORS.error }]}
          onPress={() => { setNewType('expense'); setShowAddModal(true); }}
        >
          <Text style={styles.actionEmoji}>💸</Text>
          <Text style={styles.actionText}>记支出</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.primary }]}>
          <Text style={styles.actionEmoji}>📷</Text>
          <Text style={styles.actionText}>发票识别</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.warning }]}>
          <Text style={styles.actionEmoji}>📊</Text>
          <Text style={styles.actionText}>报表</Text>
        </TouchableOpacity>
      </View>

      {/* 交易记录 */}
      <View style={styles.transactions}>
        <Text style={styles.sectionTitle}>📝 最近记录</Text>
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const cat = getCategoryInfo(item.category);
            return (
              <View style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <Text style={styles.transactionEmoji}>{cat.emoji}</Text>
                  <View>
                    <Text style={styles.transactionNote}>{item.note || cat.name}</Text>
                    <Text style={styles.transactionDate}>{item.date}</Text>
                  </View>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  { color: item.type === 'income' ? COLORS.success : COLORS.error }
                ]}>
                  {item.type === 'income' ? '+' : '-'}¥{item.amount}
                </Text>
              </View>
            );
          }}
        />
      </View>

      {/* 添加记账弹窗 */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {newType === 'income' ? '💵 记收入' : '💸 记支出'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="金额"
              keyboardType="numeric"
              value={newAmount}
              onChangeText={setNewAmount}
            />
            
            <TextInput
              style={styles.input}
              placeholder="备注"
              value={newNote}
              onChangeText={setNewNote}
            />
            
            <Text style={styles.categoryLabel}>选择分类</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {Object.entries(CATEGORIES)
                .filter(([_, v]) => v.type === newType)
                .map(([key, v]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.categoryItem,
                      newCategory === key && styles.categoryItemActive
                    ]}
                    onPress={() => setNewCategory(key)}
                  >
                    <Text style={styles.categoryEmoji}>{v.emoji}</Text>
                    <Text style={styles.categoryName}>{v.name}</Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelBtnText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.confirmBtn]}
                onPress={addTransaction}
              >
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
  balanceCard: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16, padding: 20, alignItems: 'center' },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  balanceAmount: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginTop: 5 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  statItem: { alignItems: 'center' },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  statValue: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  
  quickActions: { flexDirection: 'row', justifyContent: 'space-around', padding: 15, backgroundColor: '#fff', marginTop: -10, borderRadius: 16, marginHorizontal: 10 },
  actionBtn: { alignItems: 'center', padding: 12, borderRadius: 12, width: 75 },
  actionEmoji: { fontSize: 24 },
  actionText: { fontSize: 12, marginTop: 4, color: '#fff', fontWeight: '600' },
  
  transactions: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  transactionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10 },
  transactionLeft: { flexDirection: 'row', alignItems: 'center' },
  transactionEmoji: { fontSize: 28, marginRight: 12 },
  transactionNote: { fontSize: 15, fontWeight: '600' },
  transactionDate: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  transactionAmount: { fontSize: 16, fontWeight: 'bold' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { backgroundColor: COLORS.background, borderRadius: 12, padding: 15, fontSize: 16, marginBottom: 15 },
  categoryLabel: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
  categoryScroll: { marginBottom: 20 },
  categoryItem: { alignItems: 'center', padding: 10, marginRight: 10, borderRadius: 10, backgroundColor: COLORS.background },
  categoryItemActive: { backgroundColor: COLORS.primaryLight },
  categoryEmoji: { fontSize: 24 },
  categoryName: { fontSize: 11, marginTop: 4 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalBtn: { flex: 1, padding: 15, borderRadius: 12, alignItems: 'center', marginHorizontal: 5 },
  cancelBtn: { backgroundColor: COLORS.background },
  cancelBtnText: { fontSize: 16, color: COLORS.textSecondary },
  confirmBtn: { backgroundColor: COLORS.primary },
  confirmBtnText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
});

export default HomeScreen;
