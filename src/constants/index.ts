// 💰 财务 App 常量 - 扩展版
export const COLORS = {
  primary: '#1E88E5',
  primaryLight: '#42A5F5',
  success: '#43A047',
  error: '#E53935',
  warning: '#FB8C00',
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

// 个人收入分类
export const INCOME_CATEGORIES = {
  salary: { name: '工资', emoji: '💵', type: 'income' },
  bonus: { name: '奖金', emoji: '🎁', type: 'income' },
  investment: { name: '投资收益', emoji: '📈', type: 'income' },
  gift: { name: '礼金红包', emoji: '🧧', type: 'income' },
  freelance: { name: '兼职副业', emoji: '💪', type: 'income' },
  other_income: { name: '其他收入', emoji: '💰', type: 'income' },
};

// 个人支出分类
export const EXPENSE_CATEGORIES = {
  food: { name: '餐饮', emoji: '🍔', type: 'expense' },
  transport: { name: '交通', emoji: '🚗', type: 'expense' },
  shopping: { name: '购物', emoji: '🛍️', type: 'expense' },
  entertainment: { name: '娱乐', emoji: '🎮', type: 'expense' },
  housing: { name: '住房', emoji: '🏠', type: 'expense' },
  utilities: { name: '水电费', emoji: '💡', type: 'expense' },
  medical: { name: '医疗', emoji: '🏥', type: 'expense' },
  education: { name: '教育', emoji: '📚', type: 'expense' },
  communication: { name: '通讯', emoji: '📱', type: 'expense' },
  other_expense: { name: '其他', emoji: '📝', type: 'expense' },
};

// 公司收入分类
export const COMPANY_INCOME_CATEGORIES = {
  sales: { name: '销售收入', emoji: '💼', type: 'income' },
  service: { name: '服务收入', emoji: '🔧', type: 'income' },
  receivable: { name: '应收账款', emoji: '📋', type: 'income' },
  other_company_income: { name: '其他收入', emoji: '💰', type: 'income' },
};

// 公司支出分类
export const COMPANY_EXPENSE_CATEGORIES = {
  purchase: { name: '采购支出', emoji: '📦', type: 'expense' },
  salary: { name: '员工工资', emoji: '👥', type: 'expense' },
  rent: { name: '租金', emoji: '🏢', type: 'expense' },
  marketing: { name: '营销费用', emoji: '📢', type: 'expense' },
  travel: { name: '差旅费', emoji: '✈️', type: 'expense' },
  office: { name: '办公用品', emoji: '📎', type: 'expense' },
  utilities_company: { name: '运营费用', emoji: '⚡', type: 'expense' },
  tax: { name: '税费', emoji: '📑', type: 'expense' },
  other_company_expense: { name: '其他支出', emoji: '📝', type: 'expense' },
};

// 合并分类
export const CATEGORIES = {
  ...INCOME_CATEGORIES,
  ...EXPENSE_CATEGORIES,
  ...COMPANY_INCOME_CATEGORIES,
  ...COMPANY_EXPENSE_CATEGORIES,
};

// 资产类型
export const ASSET_TYPES = {
  cash: { name: '现金', emoji: '💵' },
  bank: { name: '银行卡', emoji: '💳' },
  alipay: { name: '支付宝', emoji: '🔵' },
  wechat: { name: '微信', emoji: '🟢' },
  stock: { name: '股票', emoji: '📈' },
  fund: { name: '基金', emoji: '📊' },
  crypto: { name: '加密货币', emoji: '🪙' },
  gold: { name: '黄金', emoji: '🥇' },
  other_asset: { name: '其他', emoji: '💰' },
};

// 预算分类
export const BUDGET_CATEGORIES = [
  'food', 'transport', 'shopping', 'entertainment', 
  'housing', 'utilities', 'medical', 'education', 'communication'
];
