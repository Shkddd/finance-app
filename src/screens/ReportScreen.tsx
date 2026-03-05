import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { COLORS, CATEGORIES } from '../constants';

const { width } = Dimensions.get('window');

// 模拟数据
const MONTHLY_DATA = [
  { month: '1月', income: 8000, expense: 4500 },
  { month: '2月', income: 8500, expense: 3800 },
  { month: '3月', income: 8000, expense: 5200 },
];

const CATEGORY_DATA = [
  { category: 'food', amount: 2800, percent: 35 },
  { category: 'transport', amount: 1200, percent: 15 },
  { category: 'shopping', amount: 1500, percent: 19 },
  { category: 'entertainment', amount: 800, percent: 10 },
  { category: 'housing', amount: 2000, percent: 25 },
  { category: 'other_expense', amount: 400, percent: 5 },
];

const ReportScreen: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const totalIncome = MONTHLY_DATA.reduce((sum, m) => sum + m.income, 0);
  const totalExpense = MONTHLY_DATA.reduce((sum, m) => sum + m.expense, 0);
  const balance = totalIncome - totalExpense;

  return (
    <ScrollView style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 财务报表</Text>
      </View>

      {/* 时间筛选 */}
      <View style={styles.periodTabs}>
        {['week', 'month', 'year'].map(period => (
          <TouchableOpacity
            key={period}
            style={[styles.periodTab, selectedPeriod === period && styles.periodTabActive]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[styles.periodText, selectedPeriod === period && styles.periodTextActive]}>
              {period === 'week' ? '本周' : period === 'month' ? '本月' : '本年'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 概览 */}
      <View style={styles.overview}>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewLabel}>总收入</Text>
          <Text style={[styles.overviewValue, { color: COLORS.success }]}>
            ¥{totalIncome.toLocaleString()}
          </Text>
        </View>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewLabel}>总支出</Text>
          <Text style={[styles.overviewValue, { color: COLORS.error }]}>
            ¥{totalExpense.toLocaleString()}
          </Text>
        </View>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewLabel}>结余</Text>
          <Text style={[styles.overviewValue, { color: balance >= 0 ? COLORS.success : COLORS.error }]}>
            ¥{balance.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* 收支趋势 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 收支趋势</Text>
        <View style={styles.chart}>
          {MONTHLY_DATA.map((item, index) => (
            <View key={index} style={styles.chartBar}>
              <View style={styles.barContainer}>
                <View style={[styles.barIncome, { height: (item.income / 10000) * 150 }]} />
                <View style={[styles.barExpense, { height: (item.expense / 10000) * 150 }]} />
              </View>
              <Text style={styles.barLabel}>{item.month}</Text>
            </View>
          ))}
        </View>
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: COLORS.success }]} />
            <Text>收入</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: COLORS.error }]} />
            <Text>支出</Text>
          </View>
        </View>
      </View>

      {/* 支出分类 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💸 支出分类</Text>
        <View style={styles.categoryList}>
          {CATEGORY_DATA.map((item, index) => {
            const cat = CATEGORIES[item.category as keyof typeof CATEGORIES] || { name: item.category, emoji: '📝' };
            return (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryLeft}>
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                </View>
                <View style={styles.categoryRight}>
                  <Text style={styles.categoryAmount}>¥{item.amount.toLocaleString()}</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${item.percent}%` }]} />
                  </View>
                  <Text style={styles.categoryPercent}>{item.percent}%</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* 财务建议 */}
      <View style={styles.advice}>
        <Text style={styles.adviceTitle}>💡 财务建议</Text>
        <View style={styles.adviceItem}>
          <Text style={styles.adviceEmoji}>⚠️</Text>
          <Text style={styles.adviceText}>
            本月餐饮支出占比 35%，略高于建议的 30%。建议适当控制外出就餐频率。
          </Text>
        </View>
        <View style={styles.adviceItem}>
          <Text style={styles.adviceEmoji}>✅</Text>
          <Text style={styles.adviceText}>
            交通支出控制良好，仅占 15%。继续保持！
          </Text>
        </View>
        <View style={styles.adviceItem}>
          <Text style={styles.adviceEmoji}>📈</Text>
          <Text style={styles.adviceText}>
            本月结余 ¥{balance.toLocaleString()}，建议将 10%（¥{(balance * 0.1).toFixed(0)}）用于投资理财。
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  
  periodTabs: { flexDirection: 'row', backgroundColor: '#fff', margin: 16, borderRadius: 12, padding: 4 },
  periodTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  periodTabActive: { backgroundColor: COLORS.primary },
  periodText: { fontSize: 14, color: COLORS.textSecondary },
  periodTextActive: { color: '#fff', fontWeight: 'bold' },
  
  overview: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16 },
  overviewCard: { flex: 1, backgroundColor: '#fff', marginHorizontal: 4, padding: 15, borderRadius: 12, alignItems: 'center' },
  overviewLabel: { fontSize: 12, color: COLORS.textSecondary },
  overviewValue: { fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  
  section: { backgroundColor: '#fff', margin: 16, padding: 16, borderRadius: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  
  chart: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 180, paddingBottom: 20 },
  chartBar: { alignItems: 'center' },
  barContainer: { flexDirection: 'row', alignItems: 'flex-end', height: 150, gap: 5 },
  barIncome: { width: 25, backgroundColor: COLORS.success, borderRadius: 4 },
  barExpense: { width: 25, backgroundColor: COLORS.error, borderRadius: 4 },
  barLabel: { marginTop: 8, fontSize: 12, color: COLORS.textSecondary },
  
  chartLegend: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, gap: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendColor: { width: 12, height: 12, borderRadius: 2 },
  
  categoryList: {},
  categoryItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  categoryLeft: { flexDirection: 'row', alignItems: 'center', width: 100 },
  categoryEmoji: { fontSize: 24, marginRight: 10 },
  categoryName: { fontSize: 14 },
  categoryRight: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  categoryAmount: { fontSize: 14, fontWeight: '600', width: 80, textAlign: 'right' },
  progressBar: { flex: 1, height: 8, backgroundColor: COLORS.border, borderRadius: 4, marginHorizontal: 10 },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  categoryPercent: { fontSize: 12, color: COLORS.textSecondary, width: 40, textAlign: 'right' },
  
  advice: { backgroundColor: '#FFF8E1', margin: 16, padding: 16, borderRadius: 12, marginBottom: 30 },
  adviceTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  adviceItem: { flexDirection: 'row', marginBottom: 10 },
  adviceEmoji: { fontSize: 18, marginRight: 10 },
  adviceText: { flex: 1, fontSize: 13, lineHeight: 20 },
});

export default ReportScreen;
