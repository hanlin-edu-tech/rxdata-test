```
gcloud functions deploy pub-score-sub-firestore --entry-point updateFirestore --env-vars-file $GCF_ENV_PATH --trigger-topic pub-score --runtime nodejs8 --region asia-northeast1 --memory 128MB --retry
```