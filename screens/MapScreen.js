import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { API_KEY2 } from "@env";
import { Button } from "@rneui/themed";

function MapScreen({ route, navigation }) {
    const { address } = route.params;
    const [region, setRegion] = React.useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const mapRef = React.useRef(null);

    const getLocation = async () => {
        const response = await fetch(`https://geocode.maps.co/search?q=${address}&api_key=${API_KEY2}`);
        const data = await response.json();
        const location = {
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
            latitudeDelta: 0.0422,
            longitudeDelta: 0.0521,
        };
        setRegion(location);
        return location;
    }

    const center = () => {
        getLocation().then(location => {
            mapRef.current.animateToRegion(location, 250);
        });
    }
    React.useEffect(() => {
        getLocation();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                region={region}
            >
                <Marker
                    coordinate={{
                        latitude: region.latitude,
                        longitude: region.longitude,
                    }}
                    title={address}
                />
            </MapView>
            <Button
                title="SHOW"
                onPress={center}
            ></Button>
        </View>
    );
};

export default MapScreen;