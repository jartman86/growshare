# App Store Submission Guide

This guide covers how to build and submit GrowShare to the Apple App Store and Google Play Store.

## Prerequisites

### For iOS (App Store)
- macOS computer with Xcode installed
- Apple Developer Account ($99/year) - [developer.apple.com](https://developer.apple.com)
- App Store Connect access

### For Android (Google Play)
- Android Studio installed
- Google Play Developer Account ($25 one-time) - [play.google.com/console](https://play.google.com/console)

## Project Setup

The app is configured to wrap the production website (https://growshare.co) using Capacitor.

### Configuration Files
- `capacitor.config.ts` - Main Capacitor configuration
- `ios/` - Native iOS project (Xcode)
- `android/` - Native Android project (Android Studio)

## Building for iOS

### 1. Open the iOS project
```bash
npm run cap:ios
# or
npx cap open ios
```

### 2. Configure signing in Xcode
1. Select the "App" target
2. Go to "Signing & Capabilities"
3. Select your team
4. Ensure "Automatically manage signing" is checked

### 3. Update app icons
Replace the icons in `ios/App/App/Assets.xcassets/AppIcon.appiconset/` with your app icons.

Required sizes:
- 20x20, 29x29, 40x40, 60x60 (2x and 3x variants)
- 76x76, 83.5x83.5 (iPad)
- 1024x1024 (App Store)

### 4. Update splash screen
Edit `ios/App/App/Assets.xcassets/Splash.imageset/`

### 5. Build and archive
1. Select "Any iOS Device" as the build target
2. Product → Archive
3. Once archived, click "Distribute App"
4. Select "App Store Connect"
5. Follow the prompts to upload

### 6. Submit in App Store Connect
1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Create a new app with bundle ID: `co.growshare.app`
3. Fill in app metadata:
   - App name: GrowShare
   - Subtitle: Connect with land, grow together
   - Category: Lifestyle
   - Screenshots (required sizes in notes below)
   - Description
   - Keywords
   - Privacy Policy URL: https://growshare.co/privacy
4. Submit for review

## Building for Android

### 1. Open the Android project
```bash
npm run cap:android
# or
npx cap open android
```

### 2. Update app icons
Replace icons in `android/app/src/main/res/`:
- `mipmap-mdpi/` (48x48)
- `mipmap-hdpi/` (72x72)
- `mipmap-xhdpi/` (96x96)
- `mipmap-xxhdpi/` (144x144)
- `mipmap-xxxhdpi/` (192x192)

### 3. Generate a signed APK/AAB
1. In Android Studio: Build → Generate Signed Bundle/APK
2. Create a new keystore or use existing
3. Select "Android App Bundle" for Play Store
4. Build the release version

### 4. Submit to Google Play
1. Go to [play.google.com/console](https://play.google.com/console)
2. Create a new app
3. Fill in store listing:
   - App name: GrowShare
   - Short description
   - Full description
   - Screenshots
   - Feature graphic (1024x500)
   - Privacy Policy URL: https://growshare.co/privacy
4. Upload the AAB file
5. Submit for review

## Screenshot Requirements

### iOS
- 6.9" Display: 1320 x 2868 or 1290 x 2796 (iPhone 15 Pro Max)
- 6.7" Display: 1290 x 2796 (iPhone 14 Plus)
- 6.5" Display: 1284 x 2778 or 1242 x 2688
- 5.5" Display: 1242 x 2208 (iPhone 8 Plus)
- iPad Pro 12.9": 2048 x 2732

### Android
- Phone: 1080 x 1920 minimum
- 7" Tablet: 1200 x 1920
- 10" Tablet: 1800 x 2560

## App Store Metadata

### Description (suggested)
```
GrowShare connects landowners with gardeners and farmers seeking land to cultivate.

Whether you have unused backyard space or acres of farmland, GrowShare helps you share your land with passionate growers in your community.

Features:
• Browse and list available plots
• Secure booking and payment system
• In-app messaging
• Crop journals to track your harvest
• Community forums and events
• Tool rental marketplace
• Produce marketplace
• Educational resources and courses

Join the growing community of land sharers today!
```

### Keywords (iOS)
gardening, farming, land rental, urban farming, community garden, backyard garden, agriculture, sustainable, local food, grow your own

### Category
- Primary: Lifestyle
- Secondary: Social Networking

## Syncing Updates

When you update the web app, the native apps will automatically show the new content since they load from the production URL.

To update native plugins or configuration:
```bash
npm run cap:sync
```

## Troubleshooting

### iOS: "Untrusted Developer"
Users need to go to Settings → General → Device Management and trust your developer certificate.

### Android: "App not installed"
Make sure the APK is signed with the same key as previous versions if updating.

### WebView issues
Check `capacitor.config.ts` for server URL configuration.
