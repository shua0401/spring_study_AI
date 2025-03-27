# タッチパッド練習アプリ

小学生向けのタッチパッド練習用ウェブアプリケーションです。手書き数字認識AIを使用して、タッチパッドで数字を書く練習ができます。

## 機能

- ランダムな数字（0-9）を表示
- タッチパッドまたはマウスで数字を書く
- AIによる数字認識
- 正解/不正解時のアニメーション表示
- 5問制のクイズ形式
- 全問正解時の祝福メッセージ

## 技術スタック

- Python
- Flask
- scikit-learn
- NumPy
- PIL (Python Imaging Library)

## セットアップ

1. リポジトリをクローン
```bash
git clone https://github.com/yourusername/spring_study_AI.git
cd spring_study_AI
```

2. 必要なパッケージをインストール
```bash
pip install -r requirements.txt
```

3. アプリケーションを実行
```bash
python app.py
```

4. ブラウザでアクセス
```
http://localhost:5000
```

## プロジェクト構造

```
spring_study_AI/
├── app.py                    # Flaskアプリケーションのメインファイル
├── static/
│   ├── css/
│   │   └── style.css        # スタイルシート
│   ├── js/
│   │   └── main.js          # JavaScriptコード
│   └── models/
│       ├── mnist_model.pkl  # 学習済みモデル
│       └── mnist_pca.pkl    # PCA変換器
├── templates/
│   └── index.html           # HTMLテンプレート
└── received_images/         # 受信した画像の保存ディレクトリ
```

## ライセンス

MIT License 