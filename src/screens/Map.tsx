import React, { memo, useEffect, useMemo, useState } from 'react'
import { Utils } from '../util'
import { Alert, View } from 'react-native'
import Colors from '../color/Colors'
import Mapbox from '@rnmapbox/maps'
import variable from '../config/AppConfig'
import { TouchableButton } from '../baseComponents/ui'
import { START, STOP, SUCCESS } from '../redux/Types'
import { onEnableLocation } from '../util/Utils'


Mapbox.setAccessToken(variable.mapboxToken);

const defaultCoordinates = [-122.483696, 37.833818];

function Map() {
    const { container, bottomContainer, buttonContainer, buttonTitle, buttonSeparator, marker }: any = getStyles()
    const [locations, setLocations] = useState<any>([])
    const [buttonStatus, setButtonStatus] = useState<string>("")
    const [isLocationCaptured, setIsLocationCaptured] = useState<boolean>(true)

    useEffect(()=>{
        getUserLocation()
    },[])

    useEffect(() => {
        let interval: number
        
        if (buttonStatus) {
            interval = setInterval(() => {
                getUserLocation()
            }, 5000);
        }
        else {
            if (interval) {
                clearInterval(interval)
            }
        }
        return () => clearInterval(interval);
    }, [buttonStatus])



    const getUserLocation = () => {
        onEnableLocation((res: string, data: any) => {
            if (res === SUCCESS) {
                storeLocations(data)
                setIsLocationCaptured(true)
            }
            else {
                setIsLocationCaptured(false)
                // handle error if we didn't get the location because of permissions
            }
        })
    }


    const storeLocations = (data: any) => {
        let tempArr:any = []
        const arr: number[] = [
            data?.coords?.longitude,
            data?.coords?.latitude
        ]
        tempArr.push(arr)
        setLocations((value:any)=> [...value,...tempArr])
    }

    const onStop = () => {
        setButtonStatus("")
    }


    const renderMap = useMemo(() => {
        const route = { "type": "Feature", "properties": {}, "geometry": { "type": "LineString", "coordinates": locations } }

        return (
            <Mapbox.MapView style={{ flex: 1 }} >
                <Mapbox.PointAnnotation
                    key="key1"
                    id="id1"
                    coordinate={locations?.length ? locations[0] : defaultCoordinates}>
                    <View style={marker} />
                        
                </Mapbox.PointAnnotation>


                <Mapbox.UserLocation
                    visible={true}
                />

                <Mapbox.Camera
                    followUserMode={'normal'}
                    followUserLocation={true}
                    followZoomLevel={17}
                    animationDuration={1000}
                    centerCoordinate={locations?.length ? locations[0] : defaultCoordinates}
                />
                {route && route?.geometry?.coordinates ?
                    <Mapbox.ShapeSource id="line" shape={route}>
                        <Mapbox.LineLayer
                            id={"linelayer"}
                            style={{
                                lineJoin: "round",
                                lineColor: ["get", "color"],
                                lineWidth: 5,
                                lineCap: "round",
                            }}
                        />
                    </Mapbox.ShapeSource>
                    : null}

                <Mapbox.PointAnnotation
                    key="key2"
                    id="id2"
                    coordinate={locations?.length ? locations[locations.length - 1] : defaultCoordinates}>
                    <View style={marker} />
                        

                </Mapbox.PointAnnotation>
            </Mapbox.MapView>
        )
    }, [locations])


    const renderBottomButtons = useMemo(() => {
        return (
            <View style={bottomContainer}>
                <TouchableButton style={buttonContainer}
                    title={START}
                    onPress={() => {isLocationCaptured ? setButtonStatus("start") : Alert.alert("Please give the permission from settings and try again.")}}
                    textStyle={buttonTitle} />
                <View style={buttonSeparator} />
                <TouchableButton
                    style={buttonContainer}
                    title={STOP}
                    onPress={onStop}
                    textStyle={buttonTitle} />

            </View>
        )
    }, [])


    return (
        <View style={container}>
            {renderMap}
            {renderBottomButtons}
        </View>
    )
}
const getStyles = () => {
    return ({
        container: {
            flex: 1,
            backgroundColor: Colors.white,
        },
        bottomContainer: {
            flexDirection: "row",
            alignItems: 'center'
        },
        buttonContainer: {
            flex: 1,
            backgroundColor: Colors.purple,
            justifyContent: 'center',
            alignItems: 'center',
            height: Utils.scaleSize(45)
        },
        buttonTitle: {
            fontSize: Utils.scaleSize(15),
            color: Colors.white,
            fontWeight: "600"
        },
        buttonSeparator: {
            backgroundColor: Colors.white,
            width: Utils.scaleSize(2),
            height: Utils.scaleSize(45)
        },
        marker:{
            height: Utils.scaleSize(25), 
            width: Utils.scaleSize(25), 
            backgroundColor: Colors.black, 
            borderRadius:Utils.scaleSize(50)
        }
    })
}

export default memo(Map)
