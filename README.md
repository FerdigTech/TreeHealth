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
