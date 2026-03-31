import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'co.growshare.app',
  appName: 'GrowShare',
  webDir: 'out',
  server: {
    // Use the production URL for the app
    url: 'https://growshare.co',
    cleartext: false,
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'GrowShare',
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
