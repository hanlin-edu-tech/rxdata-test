```
gcloud functions deploy pub-finish-sub-firestore --entry-point updateFirestore --env-vars-file $GCF_ENV_PATH --trigger-topic pub-finish --runtime nodejs8 --region asia-northeast1 --memory 128MB --retry
```