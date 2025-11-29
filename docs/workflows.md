# Workflows

See https://docs.expo.dev/workflow/overview/

TL;DR

- Development builds should be the **main** build option
  - It gives us access to the native bundle
  - But still gives us good DX with `expo-development-client` that helps with Fast Refresh
- To create a development build, use either:
  - Local builds: `npx expo run:ios`
  - EAS builds: `eas build -p ios --profile development` (profile modes are configurable)
- Expo Go is only for prototyping without native features (e.g. push notifications)

## Development builds

Uses the underlying IDEs meant for mobile development for each platform: XCode and Android Studio. When you trigger a dev build, you'll require these tools to essentially compile your app binary on your local machine.

### Build locally

Use the locally installed XCode / Android Studio dev environments for compiling locally.

```sh
npx expo run:ios
npx expo run:android
```

- This creates a `/ios` and `/android` project directory which you can directly work with; to edit any native code
- Installs a dev build of the app on your simulator

### Build with EAS

The build / release / update workflows are handled by EAS.

- This triggers upload of your project into EAS build servers for compilation
- EAS builds can be downloaded via QR code (from CLI), the (equivalent) EAS web link, or Expo Orbit (macOS app that helps you manage EAS builds and build targets)

With the CLI tool

```sh
eas build --platform ios --profile development
eas build --platform android --profile development
```

- Installs a dev build of the app on simulator or physical device
- Note that you need to setup for iOS
  1. Apple Developer account setup
  2. Device needs to be provisioned with an ad hoc profile (registers your device with developer account)
  3. Device needs to be in Developer mode (disables some default security features)

## Expo Go

| Pros                                                     | Cons                                                    |
| -------------------------------------------------------- | ------------------------------------------------------- |
| Expo Go abstracts away native bundle                     | Limited to whatever native environment Expo Go provides |
| Easily build for cross platform (i.e. no need for XCode) |                                                         |

---

# Resources

- [Create and run cloud build for iOS](https://docs.expo.dev/tutorial/eas/ios-development-build-for-devices/)
