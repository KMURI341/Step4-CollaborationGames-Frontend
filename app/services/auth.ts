// services/auth.ts
import axios from 'axios';

// API URLの設定
const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8000';

// ログイン用インターフェース
export interface LoginCredentials {
  username: string;
  password: string;
}

// ユーザー登録用インターフェース
export interface RegisterData {
  name: string;
  password: string;
  confirm_password: string;
  categories: string[];
}

// ユーザー情報更新用インターフェース
export interface UpdateUserData {
  name?: string;
  password?: string;
  confirm_password?: string;
  categories?: string[];
}

// レスポンスデータの型
export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  user_name: string;
}

// APIを使用したログイン関数
export const login = async (credentials: LoginCredentials): Promise<void> => {
  try {
    console.log("ログイン試行:", credentials);
    
    const response = await axios.post(`${API_URL}/api/v1/auth/login`, {
      username: credentials.username,
      password: credentials.password
    });
    
    const data = response.data;
    
    // ローカルストレージに認証情報を保存
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('userId', String(data.user_id));
    localStorage.setItem('userName', data.user_name);
    localStorage.setItem('isLoggedIn', 'true');
    
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// APIを使用したユーザー登録関数
export const register = async (data: RegisterData): Promise<void> => {
  try {
    console.log("ユーザー登録:", data);
    
    const response = await axios.post(`${API_URL}/api/v1/auth/register`, {
      name: data.name,
      password: data.password,
      confirm_password: data.confirm_password,
      categories: data.categories
    });
    
    const responseData = response.data;
    
    // ローカルストレージに認証情報を保存
    localStorage.setItem('token', responseData.access_token);
    localStorage.setItem('userId', String(responseData.user_id));
    localStorage.setItem('userName', responseData.user_name);
    localStorage.setItem('isLoggedIn', 'true');
    
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// APIを使用したユーザー情報更新関数
export const updateUserInfo = async (data: UpdateUserData): Promise<void> => {
  try {
    console.log("ユーザー情報更新:", data);
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('認証情報がありません。再度ログインしてください。');
    }
    
    const response = await axios.put(`${API_URL}/api/v1/users/me`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const updatedUser = response.data;
    
    // 名前の更新があった場合、ローカルストレージも更新
    if (data.name && updatedUser.name) {
      localStorage.setItem('userName', updatedUser.name);
    }
    
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

// トークンからユーザー情報を取得
export const getCurrentUser = async (): Promise<{ userId: string; userName: string } | null> => {
  if (typeof window === 'undefined') {
    return null; // サーバーサイドレンダリング時は null を返す
  }
  
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  
  if (!token) {
    return null;
  }
  
  try {
    // API からユーザー情報を取得（トークンの有効性も確認できる）
    const response = await axios.get(`${API_URL}/api/v1/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // 最新のユーザー情報で更新
    const userData = response.data;
    localStorage.setItem('userId', String(userData.id));
    localStorage.setItem('userName', userData.name);
    
    return { 
      userId: String(userData.id), 
      userName: userData.name 
    };
  } catch (error) {
    // トークンが無効または期限切れの場合
    console.error('Error getting current user:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('isLoggedIn');
    return null;
  }
};

// ログアウト関数
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('isLoggedIn');
};