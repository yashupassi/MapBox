import Geolocation from '@react-native-community/geolocation';
import { Dimensions, Platform, PixelRatio, Alert } from 'react-native';
import { ERROR, SUCCESS } from '../redux/Types';

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');

// based on iphone 5s's scale
const isPortrait = SCREEN_HEIGHT > SCREEN_WIDTH ? true : false
const scale = (isPortrait ? SCREEN_WIDTH : SCREEN_HEIGHT) / 320;

let signInProcess: any;

export default class Utils {

    static getHeightInPortraitMode = isPortrait ? SCREEN_HEIGHT : SCREEN_WIDTH;



    static isPortrait = () => {
        const {
            width,
            height,
        } = Dimensions.get('window');

        return height > width ? true : false;
    }

    static scaleSize(size: number) {
        const newSize = size * scale
        if (Platform.OS === 'ios') {
            return Math.round(PixelRatio.roundToNearestPixel(newSize))
        } else {
            return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
        }
    }

}

export const onEnableLocation = async(cb:any)=>{
    Geolocation.getCurrentPosition(
        (position:any)=>{
        cb(SUCCESS, position)
    },(error)=>{
        // This is the place Where you can handle all your permission errors, For noww only showing Alert.
        cb(ERROR, error)
        Alert.alert("Please give the permission from settings and try again.")
    },
    {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 1000
      },
    )
}