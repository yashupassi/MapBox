# MapBox
Example app for Mapbox sdk in react native


To Install App

To Run on IOS Following Commands to Run

yarn install
npx pod-install
npx react-native run-ios



In Case if you are facing issue with Mapbox pods in IOS then you need to create .netrc file, To Create that file please follow the following steps.

- Go to Terminal and write cd ~
- Press Enter.
- Write vi .netrc . It will open the empty file in the terminal.
- Press i here to insert data here. When you enter i it will open in insert mode.
- Now paste
    machine api.mapbox.com
    login mapbox
    password <"YOUR_MAPBOX_TOKEN">
- Note: Don't put < braces in password >
- Press Esc Key from keyboard.
- Write :w to write all data on file.
- Now write :q to quit from file.
- You successfully save the file.
- Run Pod install
