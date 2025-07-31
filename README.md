## ローカル起動コマンド

```bash
VITE_ENV=production VITE_GAS_ENDPOINT=最新のgasエンドポイント npm run dev VITE_FIREBASE_API_KEY=firebaseAuthのapikey VITE_FIREBASE_AUTH_DOMAIN=firebaseAuthのauthDomain VITE_FIREBASE_PROJECT_ID=firebaseAuthのprojectId npm run dev
```

## gas のコードをビルドする

```bash
GAS_SHEET_ID=GASのシートID GAS_SHEET_NAME=GASのシート名 GAS_ALLOWED_UID=GASへのアクセス許可するユーザーのUID GAS_FIREBASE_API_KEY=firebaseのapiキー sh gas/build.sh
```
