```
gcloud functions deploy pub-score-sub-count_user --entry-point calculate --env-vars-file $GCF_ENV_PATH --trigger-topic pub-score --runtime nodejs8 --region asia-northeast1 --memory 128MB --retry
```