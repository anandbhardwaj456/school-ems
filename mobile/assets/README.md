# Assets Directory

This directory is for app assets. Currently, the app uses Expo's default icons and splash screens.

## Optional Assets (for customization)

If you want to add custom assets, create the following files:

- **icon.png** (1024x1024) - App icon
- **splash.png** (1242x2436) - Splash screen image
- **adaptive-icon.png** (1024x1024) - Android adaptive icon
- **favicon.png** (48x48) - Web favicon

After adding these files, update `app.json` to reference them:

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#2563eb"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#2563eb"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

The app works fine without these custom assets - Expo provides defaults.

