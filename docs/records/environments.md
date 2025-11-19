# How env loading is done

📱 For iOS Simulator / Android Emulator

npm start # General dev server
npm run ios # Launch iOS simulator
npm run android # Launch Android emulator
Uses: .env.local → http://127.0.0.1:54321

📲 For Physical iPhone / Android Device

npm run start:device # Dev server for device
npm run ios:device # Launch on physical iPhone
npm run android:device # Launch on physical Android
Uses: .env.device → http://<your-ip-address>:54321

🌐 For Production Testing

npm run start:prod # Production environment
npm run ios:prod # iOS with production
npm run android:prod # Android with production
Uses: .env.production → https://<supabase-url>.supabase.co

How It Works

- Each script sets `ENV=local|device|production`
- app.config.js loads the corresponding `.env.*` file
- Metro clears cache (`--clear`) to pick up new env vars
- Your app connects to the right Supabase instance
