
```
gcloud functions deploy pub-finish-sub-score --entry-point calculateScore --env-vars-file $GCF_ENV_PATH --trigger-topic pub-finish --runtime nodejs8 --region asia-northeast1 --memory 128MB --retry
```