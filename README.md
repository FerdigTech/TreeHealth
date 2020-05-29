# TreeHealth Mobile
### Installation:
```sh
cd TreeHealth
npm install
npm install expo-cli -g
```
### To run:
```sh
cd TreeHealth
expo run
```
To run on [IOS](https://docs.expo.io/versions/latest/workflow/ios-simulator/) and [Android emulator](https://docs.expo.io/versions/latest/workflow/android-studio-emulator/)
### To build:
Building can be done many ways:
- Expo offers a freemium solution that can build out both IOS and Android via expo servers:

    1.) first login in to expo:
    ```sh
    expo login
    ```
    2.) build to the appropriate platofrm
    ```sh
    expo build:ios
    expo build:android
    ```
- If you wish to build standalone your best bet is to use [Turtle CLI](https://docs.expo.io/versions/latest/distribution/turtle-cli/)
```
export EXPO_ANDROID_KEYSTORE_PASSWORD="REPLACE_WITH_KEY_STORE_PASS" \
export EXPO_ANDROID_KEY_PASSWORD="REPLACE_WITH_KEY_PASS" \
turtle build:android -u "REPLACE_WITH_EXPO_USER" -p "REPLACE_WITH_EXPO_PASS" \
  --keystore-path ./TreeHealth.jks \
  --keystore-alias "REPLACE_WITH_KEY_STORE_ALIAS" \
  --type apk
  
```
### To Update:
When it comes to publishing the app, you can publish the binaries on the App Stores for each version. Or you can push an update through Over-The-Air (OTA) Updates. This is done by [publishing through Expo](https://docs.expo.io/workflow/publishing/), to do this you can run the following commands:

For stage builds:
```
expo build:ios --release-channel staging
expo build:android --release-channel staging
expo publish --release-channel staging
```

For production builds:
```
expo build:ios --release-channel prod
expo build:android --release-channel prod
expo publish --release-channel prod
```
