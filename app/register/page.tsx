"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { register, updateUserInfo } from "../services/auth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isNewUser, setIsNewUser] = useState(true); // 新規ユーザーかどうかのフラグ
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

// handleSubmit 関数内の処理を修正
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  if (isNewUser && password !== confirmPassword) {
    setError("パスワードが一致しません。");
    setIsLoading(false);
    return;
  }

  try {
    if (isNewUser) {
      // リクエストのデータ構造をログに出力して確認
      console.log("送信データ:", {
        name,
        password,
        confirm_password: confirmPassword,
        categories: selectedCategories,
      });

      // 新規ユーザー登録処理
      await register({
        name,
        password,
        confirm_password: confirmPassword,
        categories: selectedCategories,
      });
      alert("登録が完了しました！");
    } else {
      // ユーザー情報更新処理
      // ...
    }
    
    // 成功したらホーム画面に遷移
    router.push("/");
  } catch (error: any) {
    // エラー詳細をコンソールに出力
    console.error("Error object:", error);
    if (error.response) {
      console.error("Error response:", error.response.data);
    }
    
    // エラーハンドリング
    if (error.response?.data?.detail) {
      setError(error.response.data.detail);
    } else {
      setError(isNewUser ? "登録中にエラーが発生しました" : "更新中にエラーが発生しました");
    }
  } finally {
    setIsLoading(false);
  }
};

  const handleCancel = () => {
    // 入力内容をクリア
    setName("");
    setPassword("");
    setConfirmPassword("");
    setSelectedCategories([]);
    setError("");
  };

  const toggleUserType = () => {
    setIsNewUser(!isNewUser);
    // ユーザータイプが変更されたらフォームをリセット
    setName("");
    setPassword("");
    setConfirmPassword("");
    setSelectedCategories([]);
    setError("");
  };

  const categories = [
    "システム部",
    "経理部",
    "事業企画部",
    "デザイン部",
    "営業部",
    "人事部",
    "原料購買部",
    "法務部",
    "知財部",
    "情報セキュリティ部",
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-lightgreen-50 to-white">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-lightgreen-200 px-4 py-3 shadow-sm">
        <h1 className="text-xl font-bold text-lightgreen-800">
          {isNewUser ? "ユーザー登録" : "ユーザー情報変更"}
        </h1>
      </header>

      {/* メイン */}
      <main className="flex flex-col items-center justify-start px-4 pt-10 flex-1 overflow-auto">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-lightgreen-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-lightgreen-800 text-center w-full">
              {isNewUser ? "新規登録フォーム" : "情報変更フォーム"}
            </h2>
          </div>

          <div className="mb-4 flex justify-center">
            <Button
              type="button"
              variant="outline"
              className={`mr-2 ${
                isNewUser ? "bg-lightgreen-100 border-lightgreen-500" : ""
              }`}
              onClick={() => isNewUser || toggleUserType()}
              disabled={isLoading}
            >
              新規登録
            </Button>
            <Button
              type="button"
              variant="outline"
              className={`${
                !isNewUser ? "bg-lightgreen-100 border-lightgreen-500" : ""
              }`}
              onClick={() => isNewUser && toggleUserType()}
              disabled={isLoading}
            >
              情報変更
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm text-lightgreen-700 mb-1"
              >
                名前
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-lightgreen-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lightgreen-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {isNewUser && (
              <>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm text-lightgreen-700 mb-1"
                  >
                    パスワード
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-3 py-2 border border-lightgreen-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lightgreen-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm text-lightgreen-700 mb-1"
                  >
                    パスワード（確認）
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="w-full px-3 py-2 border border-lightgreen-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lightgreen-400"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm text-lightgreen-700 mb-1">
                カテゴリーを選択してください
              </label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    type="button"
                    variant={
                      selectedCategories.includes(category)
                        ? "default"
                        : "outline"
                    }
                    className={`rounded-full text-xs h-8 w-full ${
                      selectedCategories.includes(category)
                        ? "bg-lightgreen-500 text-white"
                        : "border-lightgreen-300 bg-lightgreen-50 text-lightgreen-700 hover:bg-lightgreen-100"
                    }`}
                    onClick={() => toggleCategory(category)}
                    disabled={isLoading}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 bg-lightgreen-500 hover:bg-lightgreen-600 text-white font-semibold rounded-full shadow-md"
                disabled={isLoading}
              >
                {isLoading 
                  ? (isNewUser ? "登録中..." : "更新中...") 
                  : (isNewUser ? "登録" : "変更")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-lightgreen-300 text-lightgreen-700 hover:bg-lightgreen-100 rounded-full"
                onClick={handleCancel}
                disabled={isLoading}
              >
                キャンセル
              </Button>
            </div>
          </form>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
