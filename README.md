
```
FinalProject
├─ .git
│  ├─ COMMIT_EDITMSG
│  ├─ FETCH_HEAD
│  ├─ HEAD
│  ├─ ORIG_HEAD
│  ├─ config
│  ├─ description
│  ├─ hooks
│  │  ├─ applypatch-msg.sample
│  │  ├─ commit-msg.sample
│  │  ├─ fsmonitor-watchman.sample
│  │  ├─ post-update.sample
│  │  ├─ pre-applypatch.sample
│  │  ├─ pre-commit.sample
│  │  ├─ pre-merge-commit.sample
│  │  ├─ pre-push.sample
│  │  ├─ pre-rebase.sample
│  │  ├─ pre-receive.sample
│  │  ├─ prepare-commit-msg.sample
│  │  ├─ push-to-checkout.sample
│  │  ├─ sendemail-validate.sample
│  │  └─ update.sample
│  ├─ index
│  ├─ info
│  │  └─ exclude
│  ├─ logs
│  │  ├─ HEAD
│  │  └─ refs
│  │     ├─ heads
│  │     │  └─ main
│  │     └─ remotes
│  │        └─ origin
│  │           ├─ HEAD
│  │           └─ main
│  ├─ objects
│  ├─ packed-refs
│  └─ refs
│     ├─ heads
│     │  └─ main
│     ├─ remotes
│     │  └─ origin
│     │     ├─ HEAD
│     │     └─ main
│     └─ tags
├─ .gitignore
├─ .vscode
│  └─ settings.json
├─ README.md
├─ dumpwatch
│  ├─ backend
│  │  ├─ .air.toml
│  │  ├─ bin
│  │  ├─ config
│  │  │  └─ db.go
│  │  ├─ db
│  │  │  ├─ init.sql
│  │  │  └─ scripts
│  │  │     └─ PythonPlacesInsert
│  │  │        ├─ ZA.txt
│  │  │        └─ places.py
│  │  ├─ go.mod
│  │  ├─ go.sum
│  │  ├─ internal
│  │  │  ├─ handlers
│  │  │  │  ├─ comment_handler.go
│  │  │  │  ├─ places_handler.go
│  │  │  │  ├─ report_handler.go
│  │  │  │  └─ user_handler.go
│  │  │  ├─ middleware
│  │  │  │  └─ auth.go
│  │  │  ├─ models
│  │  │  │  ├─ comment_model.go
│  │  │  │  ├─ places_model.go
│  │  │  │  ├─ report_model.go
│  │  │  │  └─ user_model.go
│  │  │  ├─ routes
│  │  │  │  └─ routes.go
│  │  │  └─ services
│  │  ├─ main.go
│  │  └─ tmp
│  │     └─ main
│  └─ frontend
│     ├─ .gitignore
│     ├─ README.md
│     ├─ cypress
│     │  ├─ downloads
│     │  ├─ e2e
│     │  │  ├─ create-report.cy.js
│     │  │  └─ navigation.cy.js
│     │  ├─ fixtures
│     │  │  └─ example.json
│     │  └─ support
│     │     ├─ commands.js
│     │     └─ e2e.js
│     ├─ cypress.config.js
│     ├─ package-lock.json
│     ├─ package.json
│     ├─ public
│     │  ├─ favicon.ico
│     │  ├─ icons
│     │  │  ├─ apple-icon-180.png
│     │  │  ├─ apple-splash-1125-2436.jpg
│     │  │  ├─ apple-splash-1136-640.jpg
│     │  │  ├─ apple-splash-1170-2532.jpg
│     │  │  ├─ apple-splash-1179-2556.jpg
│     │  │  ├─ apple-splash-1206-2622.jpg
│     │  │  ├─ apple-splash-1242-2208.jpg
│     │  │  ├─ apple-splash-1242-2688.jpg
│     │  │  ├─ apple-splash-1284-2778.jpg
│     │  │  ├─ apple-splash-1290-2796.jpg
│     │  │  ├─ apple-splash-1320-2868.jpg
│     │  │  ├─ apple-splash-1334-750.jpg
│     │  │  ├─ apple-splash-1488-2266.jpg
│     │  │  ├─ apple-splash-1536-2048.jpg
│     │  │  ├─ apple-splash-1620-2160.jpg
│     │  │  ├─ apple-splash-1640-2360.jpg
│     │  │  ├─ apple-splash-1668-2224.jpg
│     │  │  ├─ apple-splash-1668-2388.jpg
│     │  │  ├─ apple-splash-1792-828.jpg
│     │  │  ├─ apple-splash-2048-1536.jpg
│     │  │  ├─ apple-splash-2048-2732.jpg
│     │  │  ├─ apple-splash-2160-1620.jpg
│     │  │  ├─ apple-splash-2208-1242.jpg
│     │  │  ├─ apple-splash-2224-1668.jpg
│     │  │  ├─ apple-splash-2266-1488.jpg
│     │  │  ├─ apple-splash-2360-1640.jpg
│     │  │  ├─ apple-splash-2388-1668.jpg
│     │  │  ├─ apple-splash-2436-1125.jpg
│     │  │  ├─ apple-splash-2532-1170.jpg
│     │  │  ├─ apple-splash-2556-1179.jpg
│     │  │  ├─ apple-splash-2622-1206.jpg
│     │  │  ├─ apple-splash-2688-1242.jpg
│     │  │  ├─ apple-splash-2732-2048.jpg
│     │  │  ├─ apple-splash-2778-1284.jpg
│     │  │  ├─ apple-splash-2796-1290.jpg
│     │  │  ├─ apple-splash-2868-1320.jpg
│     │  │  ├─ apple-splash-640-1136.jpg
│     │  │  ├─ apple-splash-750-1334.jpg
│     │  │  ├─ apple-splash-828-1792.jpg
│     │  │  ├─ manifest-icon-192.maskable.png
│     │  │  └─ manifest-icon-512.maskable.png
│     │  ├─ index.html
│     │  ├─ manifest.json
│     │  ├─ mobile-logo.png
│     │  ├─ offline.html
│     │  ├─ robots.txt
│     │  ├─ screenshots
│     │  │  ├─ screenshot-desktop.png
│     │  │  └─ screenshot-mobile.png
│     │  ├─ sw.js
│     │  └─ vertical-logo.png
│     ├─ src
│     │  ├─ App.css
│     │  ├─ App.js
│     │  ├─ App.test.js
│     │  ├─ api
│     │  │  └─ api.js
│     │  ├─ components
│     │  │  ├─ CommunityDropdownForm.js
│     │  │  ├─ CreateReportForm.js
│     │  │  ├─ Layout.js
│     │  │  └─ PrivateRoute.js
│     │  ├─ helpers
│     │  │  ├─ i18n.js
│     │  │  └─ locales
│     │  │     ├─ af
│     │  │     │  └─ translation.json
│     │  │     ├─ en
│     │  │     │  └─ translation.json
│     │  │     ├─ xh
│     │  │     │  └─ translation.json
│     │  │     └─ zu
│     │  │        └─ translation.json
│     │  ├─ index.css
│     │  ├─ index.js
│     │  ├─ logo.svg
│     │  ├─ pages
│     │  │  ├─ CommunityPage.js
│     │  │  ├─ KnowledgeBasePage.js
│     │  │  ├─ Login.js
│     │  │  ├─ MemberHome.js
│     │  │  ├─ OrgHome.js
│     │  │  ├─ SettingsPage.js
│     │  │  └─ ViewReportPage.js
│     │  ├─ reportWebVitals.js
│     │  ├─ setupTests.js
│     │  └─ utils
│     │     └─ auth.js
│     └─ tailwind.config.js
├─ lighthouse
└─ scripts
   ├─ Network
   │  ├─ networkData.json
   │  ├─ networkMonitor.js
   │  ├─ package-lock.json
   │  └─ package.json
   └─ Python
      ├─ .ipynb_checkpoints
      │  ├─ lighthouse_stats-checkpoint.ipynb
      │  └─ netowrk_har_notebook-checkpoint.ipynb
      ├─ ZA.txt
      ├─ analyze_har.py
      ├─ lighthouse_community_page.json
      ├─ lighthouse_report_page.json
      ├─ lighthouse_stats.ipynb
      ├─ lighthouse_view_post_page.json
      ├─ netowrk_har_notebook.ipynb
      ├─ network.har
      ├─ network_stats.csv
      └─ places.py

```