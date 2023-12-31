import React, { memo, useEffect, useMemo, useState } from 'react'
import { Utils } from '../util'
import { Alert, Text, View } from 'react-native'
import Colors from '../color/Colors'
import Mapbox from '@rnmapbox/maps'
import variable from '../config/AppConfig'
import { TouchableButton } from '../baseComponents/ui'
import { START, STOP, SUCCESS } from '../redux/Types'
import { onEnableLocation } from '../util/Utils'
import { getDistance } from 'geolib';


Mapbox.setAccessToken(variable.mapboxToken);

const defaultCoordinates = [-122.483696, 37.833818];

function Map() {
    const { container, bottomContainer, buttonContainer, buttonTitle, buttonSeparator, marker, distanceText }: any = getStyles()
    const [locations, setLocations] = useState<any>([])
    const [buttonStatus, setButtonStatus] = useState<string>("")
    const [isLocationCaptured, setIsLocationCaptured] = useState<boolean>(true)
    const [distance, setDistance] = useState<number>(0)
    const [startTime, setStartTime] = useState<any>(undefined)
    const [timeDifference, setTimeDifference] = useState<any>(0)


    useEffect(() => {
        getUserLocation()
    }, [])

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
        let tempArr: any = []
        const arr: number[] = [
            data?.coords?.longitude,
            data?.coords?.latitude
        ]
        tempArr.push(arr)
        setLocations((value: any) => [...value, ...tempArr])
    }

    const calculateDistance = () => {
        const startCoordsArr = locations?.length && locations[0] || []
        const endCoordsArr = locations?.length && locations[locations.length - 1] || []
        const startPoint = { latitude: startCoordsArr?.length && startCoordsArr[0], longitude: startCoordsArr?.length && startCoordsArr[1] }
        const endPoint = { latitude: endCoordsArr?.length && endCoordsArr[0], longitude: endCoordsArr?.length && endCoordsArr[1] }

        const dis = getDistance(
            startPoint,
            endPoint,
        );
        setDistance(dis)
    };

    const onStop = () => {
        const endTime = new Date().getTime()
        const differenceTime = (endTime - startTime) / 1000
        setTimeDifference(differenceTime)
        setButtonStatus("")
        calculateDistance()

    }

    const onStart = () => {
        setStartTime(new Date().getTime())
        if (isLocationCaptured) {
            setButtonStatus("start")
        }
        else {
            Alert.alert("Please give the permission from settings and try again.")
        }
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
                    onPress={onStart}
                    textStyle={buttonTitle} />
                <View style={buttonSeparator} />
                <TouchableButton
                    style={buttonContainer}
                    title={STOP}
                    onPress={onStop}
                    textStyle={buttonTitle} />

            </View>
        )
    }, [locations, isLocationCaptured, startTime])


    return (
        <View style={container}>
            {renderMap}
            {renderBottomButtons}
             <Text style={distanceText}>{`covered ${distance} meters in ${timeDifference} seconds`}</Text>
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
        marker: {
            height: Utils.scaleSize(25),
            width: Utils.scaleSize(25),
            backgroundColor: Colors.black,
            borderRadius: Utils.scaleSize(50)
        },
        distanceText:{
            marginVertical:Utils.scaleSize(20), 
            textAlign:'center'
        }
    })
}

export default memo(Map)
