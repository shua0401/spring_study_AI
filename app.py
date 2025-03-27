from flask import Flask, render_template, request, jsonify
import numpy as np
from PIL import Image
import io
import pickle as pkl
import base64
import os
from datetime import datetime

app = Flask(__name__)

# 画像保存用のディレクトリを作成
UPLOAD_FOLDER = 'received_images'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# モデルファイルのパス
MODEL_PATH = os.path.join('static', 'models', 'mnist_model.pkl')
PCA_PATH = os.path.join('static', 'models', 'mnist_pca.pkl')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        print("予測リクエストを受信")
        # 画像データの取得
        image_data = request.json['image']
        print(f"受信したデータの長さ: {len(image_data)}")
        
        # Base64デコード
        image_bytes = base64.b64decode(image_data)
        print(f"デコード後のバイトデータの長さ: {len(image_bytes)}")
        
        # 画像の読み込み
        image = Image.open(io.BytesIO(image_bytes))
        print(f"画像サイズ: {image.size}")
        
        # 受信した画像を保存（デバッグ用）
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        original_path = os.path.join(UPLOAD_FOLDER, f'received_{timestamp}.png')
        image.save(original_path)
        print(f"受信した画像を保存: {original_path}")
        
        # 透明背景を白に変換
        if image.mode == 'RGBA':
            background = Image.new('RGBA', image.size, (255, 255, 255, 255))
            image = Image.alpha_composite(background, image)
        
        # グレースケール変換とリサイズ
        processed_image = image.convert('L').resize((28, 28))
        
        # 画像の保存（デバッグ用）
        processed_path = os.path.join(UPLOAD_FOLDER, f'processed_{timestamp}.png')
        processed_image.save(processed_path)
        print(f"前処理後の画像を保存: {processed_path}")
        
        # 画像の前処理
        image = np.array(processed_image).astype(int)
        image = 255 - image  # 白黒反転
        image = image.reshape(1, -1)
        print(f"前処理後の配列形状: {image.shape}")
        print(f"画像の値の範囲: min={image.min()}, max={image.max()}")

        # PCA変換
        print("PCA変換開始")
        with open(PCA_PATH, "rb") as f:
            pca = pkl.load(f)
        image = pca.transform(image)
        print(f"PCA変換後の形状: {image.shape}")

        # 予測
        print("予測開始")
        with open(MODEL_PATH, "rb") as f:
            model = pkl.load(f)
        prediction = model.predict(image)
        print(f"予測結果: {prediction[0]}")

        return jsonify({'prediction': int(prediction[0])})
    
    except Exception as e:
        print(f"エラーが発生: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 