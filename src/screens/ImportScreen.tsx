import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { COLORS } from '../constants';

// 模拟解析支付宝/微信账单数据
const mockAlipayData = [
  { date: '2026-03-05', type: 'expense', category: 'food', amount: 28.5, merchant: '美团外卖', method: '余额宝' },
  { date: '2026-03-04', type: 'expense', category: 'transport', amount: 4, merchant: '地铁', method: '余额宝' },
  { date: '2026-03-03', type: 'expense', category: 'shopping', amount: 199, merchant: '淘宝', method: '花呗' },
  { date: '2026-03-02', type: 'income', category: 'salary', amount: 8500, merchant: '工资', method: '转账' },
  { date: '2026-03-01', type: 'expense', category: 'housing', amount: 1500, merchant: '房租', method: '转账' },
];

const mockWechatData = [
  { date: '2026-03-05', type: 'expense', category: 'food', amount: 15, merchant: '便利店', method: '微信支付' },
  { date: '2026-03-04', type: 'expense', category: 'entertainment', amount: 50, merchant: '腾讯视频', method: '微信支付' },
  { date: '2026-03-03', type: 'expense', category: 'food', amount: 42, merchant: '火锅店', method: '微信支付' },
  { date: '2026-03-02', type: 'expense', category: 'shopping', amount: 88, merchant: '京东', method: '微信支付' },
  { date: '2026-03-01', type: 'income', category: 'gift', amount: 200, merchant: '红包', method: '收款' },
];

const ImportScreen: React.FC = () => {
  const [importing, setImporting] = useState(false);
  const [alipayConnected, setAlipayConnected] = useState(false);
  const [wechatConnected, setWechatConnected] = useState(false);
  const [lastImport, setLastImport] = useState<string | null>(null);

  // 模拟导入支付宝账单
  const importAlipay = () => {
    setImporting(true);
    Alert.alert('📷 导入支付宝账单', '请选择导入方式', [
      { text: '取消', onPress: () => setImporting(false) },
      { 
        text: '截图导入', 
        onPress: () => {
          // 模拟 OCR 识别
          setTimeout(() => {
            setImporting(false);
            setAlipayConnected(true);
            setLastImport('支付宝账单导入成功 (5笔)');
            Alert.alert('✅ 导入成功', '已导入 5 笔支付宝账单');
          }, 2000);
        }
      },
      { 
        text: 'CSV文件导入', 
        onPress: () => {
          setTimeout(() => {
            setImporting(false);
            setAlipayConnected(true);
            setLastImport('支付宝账单导入成功 (5笔)');
            Alert.alert('✅ 导入成功', '已导入 5 笔支付宝账单');
          }, 1500);
        }
      },
    ]);
  };

  // 模拟导入微信账单
  const importWechat = () => {
    setImporting(true);
    Alert.alert('📷 导入微信账单', '请选择导入方式', [
      { text: '取消', onPress: () => setImporting(false) },
      { 
        text: '截图导入', 
        onPress: () => {
          setTimeout(() => {
            setImporting(false);
            setWechatConnected(true);
            setLastImport('微信账单导入成功 (5笔)');
            Alert.alert('✅ 导入成功', '已导入 5 笔微信账单');
          }, 2000);
        }
      },
      { 
        text: 'CSV文件导入', 
        onPress: () => {
          setTimeout(() => {
            setImporting(false);
            setWechatConnected(true);
            setLastImport('微信账单导入成功 (5笔)');
            Alert.alert('✅ 导入成功', '已导入 5 笔微信账单');
          }, 1500);
        }
      },
    ]);
  };

  // 断开连接
  const disconnect = (type: 'alipay' | 'wechat') => {
    Alert.alert('确认断开', `确定要断开${type === 'alipay' ? '支付宝' : '微信'}连接吗？`, [
      { text: '取消', style: 'cancel' },
      { 
        text: '确定', 
        onPress: () => {
          if (type === 'alipay') setAlipayConnected(false);
          else setWechatConnected(false);
          Alert.alert('✅', '已断开连接');
        }
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📥 一键导入</Text>
        <Text style={styles.headerSubtitle}>支付宝/微信账单自动识别导入</Text>
      </View>

      {/* 导入方式说明 */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>💡 支持的导入方式</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoEmoji}>📷</Text>
          <View>
            <Text style={styles.infoText}>截图导入</Text>
            <Text style={styles.infoDesc}>截图支付宝/微信账单详情页，自动识别</Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoEmoji}>📄</Text>
          <View>
            <Text style={styles.infoText}>文件导入</Text>
            <Text style={styles.infoDesc}>导入 CSV/Excel 账单文件</Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoEmoji}>🔗</Text>
          <View>
            <Text style={styles.infoText}>API 对接</Text>
            <Text style={styles.infoDesc}>授权后自动同步 (开发中)</Text>
          </View>
        </View>
      </View>

      {/* 支付宝 */}
      <View style={styles.accountCard}>
        <View style={styles.accountHeader}>
          <View style={styles.accountInfo}>
            <Text style={styles.accountEmoji}>💙</Text>
            <View>
              <Text style={styles.accountName}>支付宝</Text>
              <Text style={styles.accountStatus}>
                {alipayConnected ? '✅ 已连接' : '❌ 未连接'}
              </Text>
            </View>
          </View>
          {alipayConnected && (
            <TouchableOpacity onPress={() => disconnect('alipay')}>
              <Text style={styles.disconnectBtn}>断开</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {alipayConnected ? (
          <View style={styles.connectedContent}>
            <Text style={styles.connectedTitle}>📋 最近导入</Text>
            {mockAlipayData.slice(0, 3).map((item, index) => (
              <View key={index} style={styles.billItem}>
                <Text style={styles.billMerchant}>{item.merchant}</Text>
                <Text style={[styles.billAmount, { color: item.type === 'income' ? COLORS.success : COLORS.error }]}>
                  {item.type === 'income' ? '+' : '-'}¥{item.amount}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.importBtn}
            onPress={importAlipay}
            disabled={importing}
          >
            <Text style={styles.importBtnText}>
              {importing ? '导入中...' : '📷 导入支付宝账单'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 微信 */}
      <View style={styles.accountCard}>
        <View style={styles.accountHeader}>
          <View style={styles.accountInfo}>
            <Text style={styles.accountEmoji}>💚</Text>
            <View>
              <Text style={styles.accountName}>微信支付</Text>
              <Text style={styles.accountStatus}>
                {wechatConnected ? '✅ 已连接' : '❌ 未连接'}
              </Text>
            </View>
          </View>
          {wechatConnected && (
            <TouchableOpacity onPress={() => disconnect('wechat')}>
              <Text style={styles.disconnectBtn}>断开</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {wechatConnected ? (
          <View style={styles.connectedContent}>
            <Text style={styles.connectedTitle}>📋 最近导入</Text>
            {mockWechatData.slice(0, 3).map((item, index) => (
              <View key={index} style={styles.billItem}>
                <Text style={styles.billMerchant}>{item.merchant}</Text>
                <Text style={[styles.billAmount, { color: item.type === 'income' ? COLORS.success : COLORS.error }]}>
                  {item.type === 'income' ? '+' : '-'}¥{item.amount}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.importBtn}
            onPress={importWechat}
            disabled={importing}
          >
            <Text style={styles.importBtnText}>
              {importing ? '导入中...' : '📷 导入微信账单'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 导入记录 */}
      {lastImport && (
        <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>📝 上次导入</Text>
          <Text style={styles.historyText}>{lastImport}</Text>
        </View>
      )}

      {/* 注意事项 */}
      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>⚠️ 注意事项</Text>
        <Text style={styles.noticeText}>• 截图导入需要清晰的账单详情页面</Text>
        <Text style={styles.noticeText}>• 文件导入支持 CSV 格式</Text>
        <Text style={styles.noticeText}>• 导入后请核对交易分类是否正确</Text>
        <Text style={styles.noticeText}>• 您的数据仅本地处理，不会上传服务器</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 5 },
  
  infoCard: { backgroundColor: '#fff', margin: 16, padding: 16, borderRadius: 12 },
  infoTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  infoItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoEmoji: { fontSize: 24, marginRight: 12 },
  infoText: { fontSize: 14, fontWeight: '600' },
  infoDesc: { fontSize: 12, color: COLORS.textSecondary },
  
  accountCard: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 16, padding: 16, borderRadius: 12 },
  accountHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  accountInfo: { flexDirection: 'row', alignItems: 'center' },
  accountEmoji: { fontSize: 36, marginRight: 12 },
  accountName: { fontSize: 18, fontWeight: 'bold' },
  accountStatus: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  disconnectBtn: { fontSize: 14, color: COLORS.error },
  
  importBtn: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 12, alignItems: 'center' },
  importBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  connectedContent: {},
  connectedTitle: { fontSize: 14, fontWeight: '600', marginBottom: 10, color: COLORS.textSecondary },
  billItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  billMerchant: { fontSize: 14 },
  billAmount: { fontSize: 14, fontWeight: 'bold' },
  
  historyCard: { backgroundColor: '#E3F2FD', marginHorizontal: 16, marginBottom: 16, padding: 12, borderRadius: 8 },
  historyTitle: { fontSize: 12, color: COLORS.primary, marginBottom: 5 },
  historyText: { fontSize: 14 },
  
  notice: { backgroundColor: '#FFF3E0', margin: 16, padding: 16, borderRadius: 12, marginBottom: 30 },
  noticeTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: COLORS.warning },
  noticeText: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 5, lineHeight: 18 },
});

export default ImportScreen;
