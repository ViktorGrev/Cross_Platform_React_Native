# IDATT2506 Applikasjonsutvikling Project
## Cross-Platform To-Do List App
This project is a cross-platform To-Do list application, created using React Native. The app allows users to manage multiple lists by creating, editing, deleting, and reordering items. Users can mark items as bought or unbought, with all data stored persistently in JSON format on the device. The app is optimized for Android and can run on physical devices or Android Virtual Devices (AVDs).

## Getting Started
To get the app up and running, follow these steps:

### Prerequisites
* Ensure you have Node.js and npm installed.
* Install React Native CLI globally with:
```bash
npm install -g react-native-cli
```
* Ensure your IDE (Visual Studio Code, IntelliJ, or Android Studio) is set up for React Native development.


### Installation Guide
1. Clone the Project Repository
Begin by cloning the repository from GitHub. Run:
```bash
git clone https://github.com/ViktorGrev/Cross_Platform_React_Native.git
```
2. Open the Project in Your IDE
After cloning, open the project folder in your IDE to access the code.

3. Navigate to the Project Directory
Open a terminal in your IDE, navigate to the folder where the project code was cloned.

4. Install Dependencies
Run the following command to install all project dependencies:
```bash
npm install
```

5. Prepare to Run the App on an Android Device
* If you have an Android phone, you can connect it to your computer and enable developer mode and USB debugging.
* If you don’t have an Android phone, you can use an Android Virtual Device (AVD). Follow the Android Virtual Device setup guide to create and configure an AVD. (https://developer.android.com/studio/run/managing-avds)

6. Run the Application
Once set up, you can start the application on your connected Android device or AVD using the following command:
```bash
npx react-native run-android
```

This will build and run the app, allowing you to start managing your to-do lists. Enjoy!
