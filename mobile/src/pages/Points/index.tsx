import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";

import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import MapView, { Marker } from "react-native-maps";
import { SvgUri } from "react-native-svg";
import * as Location from "expo-location";
import api from "../../services/api";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Point{
  id:number;
  name:string;
  image:string;
  latitude:number;
  longitude:number;
 
}

const Points = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [intialPosition, setInitialPosition] = useState<[number,number]>([0,0]);
  const navigation = useNavigation();


  useEffect(() => {
    api.get("items").then((response) => {
      setItems(response.data);
    });
  }, []);

  //Posição inicial
  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Oooops...",
          "Precisamos da sua permissão para obter a localização"
        );
        return;
      }
      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;

      setInitialPosition([latitude,longitude]);
    }
    loadPosition();
  }, []);

  useEffect(() =>{
    api.get('points', {
      params:{
        city:'',
        uf:'',
        items:''
      }
    }).then(response =>{
      setPoints(response.data);  
    })
  },[]);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleNatigateToDetail() {
    navigation.navigate("Detail");
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex((item) => item === id);
    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Text style={styles.title}>Bem Vindo.</Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta .
        </Text>

        <View style={styles.mapContainer}>
          {intialPosition[0] !== 0 && (
            <MapView
            style={styles.map}
            loadingEnabled ={intialPosition[0] === 0}
            initialRegion={{
              latitude: intialPosition[0],
              longitude: intialPosition[1],
              latitudeDelta: 0.014,
              longitudeDelta: 0.014,
            }}
          >
            <Marker
              onPress={handleNatigateToDetail}
              style={styles.mapMarker}
              coordinate={{
                latitude: -15.8386117518297,
                longitude: -48.120104446356,
              }}
            >
              <View style={styles.mapMarkerContainer}>
                <Image
                  style={styles.mapMarkerImage}
                  source={{
                    uri:
                      "https://lh3.googleusercontent.com/proxy/ofNHybOmdRtpB920lKQ-jq1CN9RMrOU68mc3wxPoi9LwxsudYQeX3R7Mm5vZkTlFeS6Zb-bOxSTKRl205DhwehvGTubxcBSTwrfLqVcCoRU9hSHXvQI90dnxDH7s480-p0Z2vL_jZG7RxtU",
                  }}
                ></Image>
                <Text style={styles.mapMarkerTitle}>Mercado </Text>
              </View>
            </Marker>
          </MapView>
          )}
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {},
              ]}
              onPress={() => handleSelectItem(item.id)}
              activeOpacity={0.7}
            >
              {/* Trocar endereço uri quando mudar o back-end */}
              <SvgUri width={42} height={42} uri={item.image_url} />
              <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Points;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20,
  },

  title: {
    fontSize: 20,
    fontFamily: "Ubuntu_700Bold",
    marginTop: 24,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 4,
    fontFamily: "Roboto_400Regular",
  },

  mapContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 16,
  },

  map: {
    width: "100%",
    height: "100%",
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: "#34CB79",
    flexDirection: "column",
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: "cover",
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: "Roboto_400Regular",
    color: "#FFF",
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#eee",
    height: 140,
    width: 140,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "space-between",

    textAlign: "center",
  },

  selectedItem: {
    borderColor: "#34CB79",
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: "Roboto_400Regular",
    textAlign: "center",
    fontSize: 13,
  },
});
