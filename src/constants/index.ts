// 💰 财务 App 常量
export const COLORS = {
  primary: '#1E88E5',     // 蓝色
  primaryLight: '#42A5F5',
  success: '#43A047',      // 绿色-收入
  error: '#E53935',        // 红色-支出
  warning: '#FB8C00',      // 橙色
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
};

export const ACCOUNT_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
  ASSET: 'asset',
  LIABILITY: 'liability',
} as const;

export const CATEGORIES = {
  // 收入
  salary: { name: '工资', emoji: '💵', type: 'income' },
  bonus: { name: '奖金', emoji: '🎁', type: 'income' },
  investment: { name: '投资收益', emoji: '📈', type: 'income' },
  other_income: { name: '其他收入', emoji: '💰', type: 'income' },
  
  // 支出
  food: { name: '餐饮', emoji: '🍔', type: 'expense' },
  transport: { name: '交通', emoji: '🚗', type: 'expense' },
  shopping: { name: '购物', emoji: '🛍️', type: 'expense' },
  entertainment: { name: '娱乐', emoji: '🎮', type: 'expense' },
  housing: { name: '住房', emoji: '🏠', type: 'expense' },
  utilities: { name: '水电费', emoji: '💡', type: 'expense' },
  medical: { name: '医疗', emoji: '🏥', type: 'expense' },
  education: { name: '教育', emoji: '📚', type: 'expense' },
  other_expense: { name: '其他', emoji: '📝', type: 'expense' },
};
