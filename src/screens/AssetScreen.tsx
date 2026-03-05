import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, ASSET_TYPES } from '../constants';

const STORAGE_KEY = '@finance_assets';

// 资产类型
interface Asset {
  id: string;
  name: string;
  type: string;
  balance: number;
  note: string;
}

const AssetScreen: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('cash');
  const [newBalance, setNewBalance] = useState('');
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const dataStr = await AsyncStorage.getItem(STORAGE_KEY);
      if (dataStr) {
        setAssets(JSON.parse(dataStr));
      } else {
        // 默认资产
        setAssets([
          { id: '1', name: '现金', type: 'cash', balance: 2000, note: '日常现金' },
          { id: '2', name: '工资卡', type: 'bank', balance: 15000, note: '' },
          { id: '3', name: '支付宝', type: 'alipay', balance: 5000, note: '' },
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveAssets = async (newAssets: Asset[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newAssets));
      setAssets(newAssets);
    } catch (e) {
      console.error(e);
    }
  };

  const addAsset = () => {
    if (!newName || !newBalance) return;
    
    const asset: Asset = {
      id: Date.now().toString(),
      name: newName,
      type: newType,
      balance: parseFloat(newBalance),
      note: newNote,
    };
    
    saveAssets([...assets, asset]);
    setNewName('');
    setNewBalance('');
    setNewNote('');
    setShowAddModal(false);
  };

  const deleteAsset = (id: string) => {
    saveAssets(assets.filter(a => a.id !== id));
  };

  const totalBalance = assets.reduce((sum, a) => sum + a.balance, 0);

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏦 资产管理</Text>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>总资产</Text>
          <Text style={styles.totalAmount}>¥{totalBalance.toLocaleString()}</Text>
        </View>
      </View>

      {/* 资产列表 */}
      <ScrollView style={styles.list}>
        {assets.map(asset => {
          const assetType = ASSET_TYPES[asset.type as keyof typeof ASSET_TYPES] || { name: asset.type, emoji: '💰' };
          return (
            <View key={asset.id} style={styles.assetItem}>
              <View style={styles.assetLeft}>
                <Text style={styles.assetEmoji}>{assetType.emoji}</Text>
                <View>
                  <Text style={styles.assetName}>{asset.name}</Text>
                  <Text style={styles.assetType}>{assetType.name}</Text>
                </View>
              </View>
              <View style={styles.assetRight}>
                <Text style={styles.assetBalance}>¥{asset.balance.toLocaleString()}</Text>
                <TouchableOpacity onPress={() => deleteAsset(asset.id)}>
                  <Text style={styles.deleteBtn}>删除</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* 添加按钮 */}
      <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
        <Text style={styles.addBtnText}>+ 添加资产</Text>
      </TouchableOpacity>

      {/* 添加弹窗 */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>添加资产</Text>
            
            <TextInput
              style={styles.input}
              placeholder="名称 (如: 工资卡)"
              value={newName}
              onChangeText={setNewName}
            />
            
            <TextInput
              style={styles.input}
              placeholder="余额"
              keyboardType="numeric"
              value={newBalance}
              onChangeText={setNewBalance}
            />

            <Text style={styles.typeLabel}>类型</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
              {Object.entries(ASSET_TYPES).map(([key, v]) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.typeItem, newType === key && styles.typeItemActive]}
                  onPress={() => setNewType(key)}
                >
                  <Text style={styles.typeEmoji}>{v.emoji}</Text>
                  <Text style={styles.typeName}>{v.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TextInput
              style={[styles.input, { marginTop: 15 }]}
              placeholder="备注 (可选)"
              value={newNote}
              onChangeText={setNewNote}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setShowAddModal(false)}>
                <Text style={styles.cancelBtnText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.confirmBtn]} onPress={addAsset}>
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
  totalCard: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16, padding: 20, alignItems: 'center' },
  totalLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  totalAmount: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginTop: 5 },
  
  list: { flex: 1, padding: 16 },
  assetItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10 },
  assetLeft: { flexDirection: 'row', alignItems: 'center' },
  assetEmoji: { fontSize: 32, marginRight: 12 },
  assetName: { fontSize: 16, fontWeight: '600' },
  assetType: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  assetRight: { alignItems: 'flex-end' },
  assetBalance: { fontSize: 18, fontWeight: 'bold', color: COLORS.success },
  deleteBtn: { fontSize: 12, color: COLORS.error, marginTop: 4 },
  
  addBtn: { backgroundColor: COLORS.primary, margin: 16, padding: 15, borderRadius: 12, alignItems: 'center' },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { backgroundColor: COLORS.background, borderRadius: 12, padding: 15, fontSize: 16, marginBottom: 15 },
  typeLabel: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
  typeScroll: { marginBottom: 15 },
  typeItem: { alignItems: 'center', padding: 10, marginRight: 10, borderRadius: 10, backgroundColor: COLORS.background },
  typeItemActive: { backgroundColor: COLORS.primaryLight },
  typeEmoji: { fontSize: 24 },
  typeName: { fontSize: 11, marginTop: 4 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalBtn: { flex: 1, padding: 15, borderRadius: 12, alignItems: 'center', marginHorizontal: 5 },
  cancelBtn: { backgroundColor: COLORS.background },
  cancelBtnText: { fontSize: 16, color: COLORS.textSecondary },
  confirmBtn: { backgroundColor: COLORS.primary },
  confirmBtnText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
});

export default AssetScreen;
