import { Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function TouchableButton(props:any) {
  const {
    style,
    activeOpacity=0.6,
    textStyle,
    title,
    ...otherProps
} = props;
  return (
    <TouchableOpacity style={style} {...otherProps} activeOpacity = {activeOpacity}>
     <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  )
}