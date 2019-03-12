#!/bin/bash

project=$1
cname=$2
region=$3
zone=$4

#環境配置
gcloud config set project ${project}
gcloud config set compute/zone ${zone}
gcloud container clusters get-credentials ${cname}

# pub / sub 清除
gcloud pubsub subscriptions delete pub-question-sub-firestore
gcloud pubsub topics delete pub-question

gcloud pubsub subscriptions delete pub-score-sub-firestore
gcloud pubsub topics delete pub-user

gcloud pubsub subscriptions delete pub-score-sub-count_question
gcloud pubsub subscriptions delete pub-score-sub-count_user
gcloud pubsub subscriptions delete pub-score-sub-analysis
gcloud pubsub subscriptions delete pub-score-sub-firestore
gcloud pubsub topics delete pub-score

gcloud pubsub subscriptions delete pub-finish-sub-score
gcloud pubsub subscriptions delete pub-finish-sub-firestore
gcloud pubsub topics delete pub-finish

#取得 k8s 後面 nodes 的 name
igawk="match(\$1, /^gke\-${cname}\-default\-pool/){print \$1}"
igname=`gcloud compute instance-groups list | awk "$igawk"`

#殺 lb
gcloud compute forwarding-rules delete ${cname}-http --global --quiet
gcloud compute target-http-proxies delete ${cname}-http-proxy --quiet
gcloud compute url-maps delete ${cname}-lb --quiet

gcloud compute backend-services remove-backend ${cname}-k8s-node-backend-service \
    --instance-group $igname \
    --instance-group-zone ${zone} \
    --global \
    --quiet

gcloud compute backend-services delete ${cname}-k8s-node-backend-service --global --quiet

#刪 ip
gcloud compute addresses delete ${cname}-lb-ip --global --quiet

#刪 node 的健檢
gcloud compute http-health-checks delete ${cname}-k8s-node-health-check --quiet

#GCP 殺 k8s
gcloud container clusters delete $cname --quiet

#清網路設定
gcloud compute firewall-rules delete ${cname}-internal --quiet
gcloud compute firewall-rules delete ${cname}-default --quiet
gcloud compute networks subnets delete ${cname}-vpc-subnets --quiet
gcloud compute networks delete ${cname}-vpc --quiet