import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS, CATEGORIES } from '../constants';

// OCR 模拟结果
interface InvoiceResult {
  amount: number;
  date: string;
  seller: string;
  category: string;
}

const InvoiceScreen: React.FC = () => {
  const [invoiceImg, setInvoiceImg] = useState<string | null>(null);
  const [result, setResult] = useState<InvoiceResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  // 模拟 OCR 识别
  const simulateOCR = () => {
    Alert.alert('📷 扫描发票', '正在识别中...', [
      { text: '取消' },
      { 
        text: '模拟结果', 
        onPress: () => {
          setResult({
            amount: 158.00,
            date: '2026-03-05',
            seller: '某某超市',
            category: 'food',
          });
          setShowResult(true);
        }
      }
    ]);
  };

  // 确认并记账
  const confirmAndRecord = () => {
    Alert.alert('✅ 已记账', `金额: ¥${result?.amount}\n商家: ${result?.seller}`, [
      { text: '好的', onPress: () => setShowResult(false) }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📷 发票识别</Text>
        <Text style={styles.headerSubtitle}>拍照上传发票，AI自动识别记账</Text>
      </View>

      {/* 扫描区域 */}
      <View style={styles.scanArea}>
        {invoiceImg ? (
          <View style={styles.preview}>
            <Text style={styles.previewText}>📄 发票图片</Text>
          </View>
        ) : (
          <View style={styles.scanPlaceholder}>
            <Text style={styles.scanEmoji}>🧾</Text>
            <Text style={styles.scanText}>点击扫描发票</Text>
            <Text style={styles.scanHint}>支持增值税发票、普通发票</Text>
          </View>
        )}
      </View>

      {/* 扫描按钮 */}
      <TouchableOpacity style={styles.scanButton} onPress={simulateOCR}>
        <Text style={styles.scanButtonText}>📷 扫描发票</Text>
      </TouchableOpacity>

      {/* 识别结果 */}
      {showResult && result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>✅ 识别结果</Text>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>金额:</Text>
            <Text style={styles.resultValue}>¥{result.amount.toFixed(2)}</Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>日期:</Text>
            <Text style={styles.resultValue}>{result.date}</Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>商家:</Text>
            <Text style={styles.resultValue}>{result.seller}</Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>分类:</Text>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryEmoji}>
                {CATEGORIES[result.category as keyof typeof CATEGORIES]?.emoji}
              </Text>
              <Text style={styles.categoryName}>
                {CATEGORIES[result.category as keyof typeof CATEGORIES]?.name}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={confirmAndRecord}>
            <Text style={styles.confirmButtonText}>✅ 确认并记账</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 功能说明 */}
      <View style={styles.features}>
        <Text style={styles.featuresTitle}>💡 功能说明</Text>
        <View style={styles.featureItem}>
          <Text style={styles.featureEmoji}>📷</Text>
          <View>
            <Text style={styles.featureTitle}>拍照识别</Text>
            <Text style={styles.featureDesc}>自动识别发票金额、日期、商家</Text>
          </View>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureEmoji}>🤖</Text>
          <View>
            <Text style={styles.featureTitle}>AI 分类</Text>
            <Text style={styles.featureDesc}>智能判断费用类型</Text>
          </View>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureEmoji}>📊</Text>
          <View>
            <Text style={styles.featureTitle}>自动记账</Text>
            <Text style={styles.featureDesc}>识别结果直接生成记账记录</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 5 },
  
  scanArea: { margin: 20, height: 200, justifyContent: 'center', alignItems: 'center' },
  scanPlaceholder: { width: '100%', height: '100%', backgroundColor: '#fff', borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  scanEmoji: { fontSize: 60, marginBottom: 10 },
  scanText: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  scanHint: { fontSize: 12, color: COLORS.textSecondary, marginTop: 5 },
  preview: { width: '100%', height: '100%', backgroundColor: '#E0E0E0', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  previewText: { fontSize: 18, color: COLORS.textSecondary },
  
  scanButton: { backgroundColor: COLORS.primary, marginHorizontal: 20, padding: 15, borderRadius: 12, alignItems: 'center' },
  scanButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  resultCard: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 16 },
  resultTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  resultLabel: { color: COLORS.textSecondary, fontSize: 14 },
  resultValue: { fontSize: 14, fontWeight: '600' },
  categoryTag: { flexDirection: 'row', alignItems: 'center' },
  categoryEmoji: { fontSize: 16 },
  categoryName: { fontSize: 14, marginLeft: 5 },
  
  confirmButton: { backgroundColor: COLORS.success, padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 15 },
  confirmButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  features: { padding: 20 },
  featuresTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  featureEmoji: { fontSize: 30, marginRight: 15 },
  featureTitle: { fontSize: 15, fontWeight: '600' },
  featureDesc: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
});

export default InvoiceScreen;
