web
- 作答頁 (選user、5題、選答案、交卷)
- 成績單頁 (即時連動 user、exam、question 資料)
- 成績清單頁 (選user，即時連動 exam list 資料)

---

交卷
- watcher-finish (監看 exam finish == true，把有變動的 id 寫入交卷 pub-finish)
- pub-finish-sub-firestore (把使用者相關資料寫入 firestore 的 exam)
- pub-finish-sub-score (計算考卷得分，寫回 mongodb)

---

考卷分析
- watcher-score (監看 exam score != null，把有變動的 id 寫入交卷 pub-score)
- pub-score-sub-firestore (把 exam score 相關資料寫入 firestore 的 exam)
- pub-score-sub-analysis (產生 exam 分析)
- pub-score-sub-count_user (統計使用者相關資訊)
- pub-score-sub-count_question (統計題目相關資訊)

---

更新使用者資訊
- watcher-user (監看 user count 的變化，把有變動的 id 寫入 pub-user)
- pub-user-sub-firestore (把 user count 寫入 firestore 的 user)

---

更新題目資訊
- watcher-question (監看 question count 的變化，把有變動的 id 寫入 pub-question)
- pub-question-sub-firestore (把 question count 寫入 firestore 的 question)


```
gcp-init.sh [PROJECT] [CNAME] [REGION] [ZONE]
export GCP_PROJECT=[PROJECT]
export GCP_USER_ACCOUNT=[ACCOUNT]
export GOOGLE_APPLICATION_CREDENTIALS=[PATH]
export GCF_CREDENTIALS_PATH=[PATH]
export MONGODB_URI=[URI]


docker build -f web/Dockerfile -t gcr.io/$GCP_PROJECT/rxdata-web --build-arg gcp_credentials_path=$GCF_CREDENTIALS_PATH --build-arg mongodb_uri=$MONGODB_URI .

docker build -f finish/watcher-finish/Dockerfile -t gcr.io/$GCP_PROJECT/watcher-finish --build-arg gcp_credentials_path=$GCF_CREDENTIALS_PATH --build-arg mongodb_uri=$MONGODB_URI .
docker build -f finish/pub-finish-sub-firestore/Dockerfile -t gcr.io/$GCP_PROJECT/pub-finish-sub-firestore --build-arg gcp_credentials_path=$GCF_CREDENTIALS_PATH --build-arg mongodb_uri=$MONGODB_URI .
docker build -f finish/pub-finish-sub-score/Dockerfile -t gcr.io/$GCP_PROJECT/pub-finish-sub-score --build-arg gcp_credentials_path=$GCF_CREDENTIALS_PATH --build-arg mongodb_uri=$MONGODB_URI .


docker build -f analysis/watcher-score/Dockerfile -t gcr.io/$GCP_PROJECT/watcher-score --build-arg gcp_credentials_path=$GCF_CREDENTIALS_PATH --build-arg mongodb_uri=$MONGODB_URI .
docker build -f analysis/pub-score-sub-firestore/Dockerfile -t gcr.io/$GCP_PROJECT/pub-score-sub-firestore --build-arg gcp_credentials_path=$GCF_CREDENTIALS_PATH --build-arg mongodb_uri=$MONGODB_URI .
docker build -f analysis/pub-score-sub-count_user/Dockerfile -t gcr.io/$GCP_PROJECT/pub-score-sub-count_user --build-arg gcp_credentials_path=$GCF_CREDENTIALS_PATH --build-arg mongodb_uri=$MONGODB_URI .

docker build -f user/watcher-user/Dockerfile -t gcr.io/$GCP_PROJECT/watcher-user --build-arg gcp_credentials_path=$GCF_CREDENTIALS_PATH --build-arg mongodb_uri=$MONGODB_URI .
docker build -f user/pub-user-sub-firestore/Dockerfile -t gcr.io/$GCP_PROJECT/pub-user-sub-firestore --build-arg gcp_credentials_path=$GCF_CREDENTIALS_PATH --build-arg mongodb_uri=$MONGODB_URI .

gcloud auth configure-docker

docker push gcr.io/$GCP_PROJECT/rxdata-web:latest
docker push gcr.io/$GCP_PROJECT/watcher-finish:latest
docker push gcr.io/$GCP_PROJECT/pub-finish-sub-firestore:latest
docker push gcr.io/$GCP_PROJECT/pub-finish-sub-score:latest
docker push gcr.io/$GCP_PROJECT/watcher-score:latest
docker push gcr.io/$GCP_PROJECT/pub-score-sub-firestore:latest
docker push gcr.io/$GCP_PROJECT/pub-score-sub-count_user:latest
docker push gcr.io/$GCP_PROJECT/watcher-user:latest
docker push gcr.io/$GCP_PROJECT/pub-user-sub-firestore:latest


envsubst < k8s/nginx-ingress-controller.yaml | kubectl apply -f -
envsubst < k8s/watcher.yaml | kubectl apply -f -
envsubst < k8s/finish.yaml | kubectl apply -f -
envsubst < k8s/score.yaml | kubectl apply -f -
envsubst < k8s/user.yaml | kubectl apply -f -
envsubst < k8s/web.yaml | kubectl apply -f -

```

```
gcp-clean.sh [PROJECT] [CNAME] [REGION] [ZONE]
```
