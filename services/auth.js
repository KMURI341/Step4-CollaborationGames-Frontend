// services/auth.js
export async function login(username, password) {
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error('ログインに失敗しました');
      }
  
      return await response.json();
    } catch (error) {
      console.error('ログインエラー:', error);
      throw error;
    }
  }
  
  export async function register(userData) {
    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error('ユーザー登録に失敗しました');
      }
  
      return await response.json();
    } catch (error) {
      console.error('登録エラー:', error);
      throw error;
    }
  }
