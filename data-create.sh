#!/bin/bash

mongo ${MONGODB_URI} --eval 'for(var i=0 ; i<5 ; i++){db.user.insert({_id : `u_${i}`, name : `學生${i}`, total : NumberLong(0), correct : NumberLong(0)});}'

mongo ${MONGODB_URI} --eval 'for(var i=0 ; i<5 ; i++){db.knowledge.insert({_id : `k_${i}`, name : `知識點${i}`, total : NumberLong(0), correct : NumberLong(0)});}'

mongo ${MONGODB_URI} --eval 'for(var i=0 ; i<5 ; i++){db.question.insert({_id : `q_${i}`, question : `題目${i}`, answer : NumberInt(i), knowledge : [`k_${i%5}`,`k_${(i+1)%5}`], total : NumberLong(0), correct : NumberLong(0)});}'