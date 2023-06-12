const appKeys = {
    mapboxToken:"pk.eyJ1Ijoic3RyaW5nZmlyZTc4NiIsImEiOiJjbGlybWRpeG0xM2xnM2VsYjF6eGFxMm80In0.sOTc0KwQbUMpZfjokVeLow",    
}

let variable = appKeys

if (__DEV__) {
    variable = appKeys
}

export default variable;