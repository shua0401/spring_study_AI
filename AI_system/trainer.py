import pickle as pkl

from sklearn.datasets import fetch_openml
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.decomposition import PCA
from sklearn.metrics import accuracy_score

# データ読み込み
mnist_x, mnist_y = fetch_openml("mnist_784", return_X_y=True)
mnist_x = mnist_x.to_numpy()
mnist_y = mnist_y.to_numpy().astype(int)

pca = PCA(n_components=20)
decomp = pca.fit_transform(mnist_x)

train_x, test_x, train_y, test_y = train_test_split(
    decomp, mnist_y, test_size=0.2, random_state=123
)

# モデルを学習させる
model = SVC()
model.fit(train_x, train_y)

# 精度検証
pred = model.predict(test_x)
print(f"精度: {accuracy_score(pred, test_y):.1%}")

# モデルを保存する
with open("mnist_model.pkl", "wb") as f:
    pkl.dump(model, f)#モデルそのものを保存ピクルを使ったらmnistを保存できるclassも保存できる

# PCAモデルも使うので保存しておく
with open("mnist_pca.pkl", "wb") as f:
    pkl.dump(pca, f)
