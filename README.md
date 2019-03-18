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
export GOOGLE_APPLICATION_CREDENTIALS=[PATH]
export MONGODB_URI=[URI]
```

```
gcp-clean.sh [PROJECT] [CNAME] [REGION] [ZONE]
```