import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, FlatList, View } from "react-native";
import { Button, ListItem, Input, Header, Icon } from "@rneui/themed";
import { getDatabase, ref, onValue, push, remove } from "firebase/database";
import { initializeApp } from "firebase/app";
import { API_KEY, APP_ID, MSG_ID, URL } from "@env";
import { Divider } from "@rneui/base";

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: "myplaces-dcbfe.firebaseapp.com",
    databaseURL: URL,
    projectId: "myplaces-dcbfe",
    storageBucket: "myplaces-dcbfe.appspot.com",
    messagingSenderId: MSG_ID,
    appId: APP_ID
  };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


export default function PlacesScreen({ navigation }) {
    const [places, setPlaces] = React.useState([]);
    const [newPlace, setNewPlace] = React.useState("");

    useEffect(() => {
        const placesRef = ref(database, 'places/');
        onValue(placesRef, (snapshot) => {
            const data = snapshot.val();
            const placesList = Object.keys(data).map(key => ({ id: key, value: data[key] }));
            setPlaces(placesList);
        });
    }, []);

    const saveItem = () => {
        const placesRef = ref(database, 'places/');
        push(placesRef, newPlace);
        setNewPlace("");
    };

    const deleteItem = (id) => {
        const placesRef = ref(database, `places/${id}`);
        remove(placesRef);
    }

    return (
        <View style={styles.container}>
            <Input
                style={[styles.input, { marginTop: 10, fontSize: 20 }]}
                placeholder="Type in address"
                value={newPlace}
                label="PLACEFINDER"
                onChangeText={setNewPlace}
            />
            <Button
                raised icon={{ name: 'save', color: 'white' }}
                title="Save"
                onPress={() => {
                    saveItem();
                }}
                containerStyle={{ width: "80%", marginBottom: 10}}
            ></Button>
            <Divider style={{ width: "80%", height: 1, alignSelf: 'center', color: 'black' }} />
            <FlatList
                style={{ width: "100%", flex: 1}}
                data={places}
                renderItem={({ item }) => (
                    <ListItem bottomDivider>
                        <ListItem.Content style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <ListItem.Title style={{maxWidth: "50%"}}>{item.value}</ListItem.Title>
                            <Button
                                title="show on map" 
                                onPress={() => navigation.navigate("Map", { address: item.value })}
                                type="clear"
                                icon={{name: "navigate-next"}}
                                iconRight 
                                onLongPress={() => deleteItem(item.id)}
                                />
                        </ListItem.Content>
                    </ListItem>
                )}
            />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        marginTop: 5,
        alignItems: "center",
    },
});
