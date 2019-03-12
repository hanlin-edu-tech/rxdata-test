#!/bin/bash

project=$1
cname=$2
region=$3
zone=$4

#環境配置
gcloud config set project ${project}
gcloud config set compute/zone ${zone}

#網路設定
gcloud compute networks create ${cname}-vpc \
    --subnet-mode custom

gcloud compute networks subnets create ${cname}-vpc-subnets \
    --network ${cname}-vpc \
    --region ${region} \
    --range 172.16.8.0/24

gcloud compute firewall-rules create ${cname}-default \
    --network ${cname}-vpc \
    --allow tcp:22,tcp:3389,tcp:10256,tcp:30000,icmp

gcloud compute firewall-rules create ${cname}-internal \
    --network ${cname}-vpc \
    --source-ranges 172.16.8.0/24 \
    --allow tcp,udp,icmp

#GCP 上建 k8s
gcloud container clusters create ${cname} \
    --image-type=cos \
    --cluster-version=1.12.5-gke.10 \
    --num-nodes 1 \
    --machine-type g1-small \
    --network ${cname}-vpc \
    --subnetwork ${cname}-vpc-subnets

gcloud container clusters get-credentials ${cname}

#建 node 的健檢
gcloud compute http-health-checks create ${cname}-k8s-node-health-check \
    --check-interval 2s \
    --port 10256 \
    --request-path /healthz \
    --timeout 1s 

#取得 k8s 後面 nodes 的 name
igawk="match(\$1, /^gke\-${cname}\-default\-pool/){print \$1}"
igname=`gcloud compute instance-groups list | awk "$igawk"`

#建立一個 lb 用的 ip
gcloud compute addresses create ${cname}-lb-ip \
    --ip-version=IPV4 \
    --global

#設定 bg nodes 對應的 port
gcloud compute instance-groups set-named-ports ${igname} --named-ports http:30000

#建立一個 lb 用的後端服務
gcloud compute backend-services create ${cname}-k8s-node-backend-service \
    --protocol HTTP \
    --http-health-checks ${cname}-k8s-node-health-check \
    --global

#把 k8s 的 instance 加入 lb 用的後端服務
gcloud compute backend-services add-backend ${cname}-k8s-node-backend-service \
    --balancing-mode UTILIZATION \
    --max-utilization 0.8 \
    --capacity-scaler 1 \
    --instance-group ${igname} \
    --instance-group-zone ${zone} \
    --global

#產生 k8s 用的 lb
gcloud compute url-maps create ${cname}-lb \
    --default-service ${cname}-k8s-node-backend-service

gcloud compute target-http-proxies create ${cname}-http-proxy \
    --url-map ${cname}-lb

gcloud compute forwarding-rules create ${cname}-http \
    --address ${cname}-lb-ip \
    --target-http-proxy ${cname}-http-proxy \
    --ports 80 \
    --global
