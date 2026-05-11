---
fields:
  - name: book-title
    type: Input
    options: {}
    path: ""
    id: 9bi5BO
  - name: book-authors
    type: Multi
    options:
      sourceType: ValuesList
      valuesList: {}
    path: ""
    id: YWDoWI
  - name: book-publisher
    type: Input
    options: {}
    path: ""
    id: j7xSY4
  - name: book-publication-date
    type: Date
    options:
      dateShiftInterval: 1 day
      dateFormat: YYYY-MM-DD
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: u0x702
  - name: book-media-type
    type: Multi
    options:
      sourceType: ValuesList
      valuesList:
        "1": Book
        "2": Kindle
        "3": Audible
    path: ""
    id: IzGuol
  - name: book-asin
    type: Input
    options: {}
    path: ""
    id: VZ4jxU
  - name: book-url
    type: Input
    options: {}
    path: ""
    id: b39HBh
  - name: book-pages
    type: Number
    options: {}
    path: ""
    id: mxKaJR
  - name: book-cover
    type: Input
    options: {}
    path: ""
    id: npqSYa
  - name: book-status
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": 読みたい
        "2": 読んでる
        "3": 購入済
        "4": 読み終わった
    path: ""
    id: ay9icf
version: "2.14"
limit: 20
mapWithTag: false
icon: package
tagNames:
filesPaths:
bookmarksGroups:
excludes:
extends:
savedViews: []
favoriteView:
fieldsOrder:
  - ay9icf
  - npqSYa
  - mxKaJR
  - b39HBh
  - VZ4jxU
  - IzGuol
  - u0x702
  - j7xSY4
  - YWDoWI
  - 9bi5BO
---
