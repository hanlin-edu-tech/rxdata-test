```
gcloud functions deploy pub-user-sub-firestore --entry-point updateFirestore --env-vars-file $GCF_ENV_PATH --trigger-topic pub-user --runtime nodejs8 --region asia-northeast1 --memory 128MB --retry
```