
import * as React from 'react';

import {Component, useState, useEffect} from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, Button, Alert, ScrollView, Modal } from 'react-native';

import styles from "../styles";

import { AuthContext } from '../components/context.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*
 APP HOME
 */
export default Directorio = ({ navigation, route }) => {
    //request tipo POST hacia el API RestFul, request y response en formato JSON
    const [dataMostrar, setDataMostrar] = useState([]);

    useEffect(() => {
        fetch(global.UBYMED_WS_BASE + 'api/usuario', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: "getDirectorioCategorias",
            })
        }).then((response) => response.json())
        .then((responseJson) => {
            if(responseJson["error"] === true) {
                //error en las variables del request
                Alert.alert(responseJson["data"]);
            } else if(responseJson["auth"] === false) {
                //error de autenticación
                Alert.alert(responseJson["data"]);
            } else {
                //autenticación correcta
                if (responseJson["data"].length > 0) {
                    setDataMostrar(responseJson["data"]);    
                } else {
                    setShowModal(true);
                }
            } 
        }).catch((error) => {
            //escribir los errores serveros en la consola e informar al usuario
            console.error(error);
            Alert.alert("Ha ocurrido un error crítico, por favor, intentelo de nuevo más tarde");
        });
        verificarPrimerUso();
    }, []);


    const [showModal, setShowModal] = useState(false);

    const [showModalLoc, setShowModalLoc] = useState(false);
    const verificarPrimerUso = async () => {
        const value = await AsyncStorage.getItem('ya_utilizada');
        if (value !== "1") {
            AsyncStorage.setItem('ya_utilizada', "1");
            setShowModalLoc(true);
        }
    }

      return (
        <ScrollView>

<Modal
          animationType="slide"
          transparent={true}
          visible={showModalLoc}
          onRequestClose={() => {
            setShowModalLoc(!showModalLoc);
          }}
        >
          <View style={styles.centeredViewLocation}>
            <View style={styles.modalViewLocation}>

                <View style={styles.locImageContainer}>
                    <Image style={styles.locImage} source={require('../assets/location_dialog.png')} resizeMode="contain" />
                </View>

              <Text style={styles.modalTextLoc}>Si tú lo permites, Ubymed utilizará la ubicación de tu dispositivo para mostrarte los establecimientos más cercanos y facilitar la llegada de nuestros médicos y paramédicos. Esta información no será compartida ni enlazada a tu identidad.</Text>
              <Text style={styles.modalTextLoc}>Si prefieres no compartir tu ubicación exacta también puedes seguir utilizando la aplicación. Sin embargo algunas funciones pueden estar limitadas y tendrás que indicarnos la dirección de llegada manualmente.</Text>
            <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                    setShowModalLoc(false);
                }}
            >
                <Text style={styles.textStyle}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={() => {
            setShowModal(!showModal);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitleText}>Servicio no disponible</Text>
              <Text style={styles.modalText}>Lo sentimos. En este momento no hay directorios disponibles</Text>
            <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                        navigation.navigate('Home');
                }}
            >
                <Text style={styles.textStyle}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


            <View style={styles.containerServicios}>
                <View style={styles.containerServiciosHeader}>
                    <Image source={require('../assets/home_directorio.png')} style={[styles.serviciosHeaderImg, styles.homeImgBgDir]} resizeMode="stretch" />
                </View>

                <Text style={styles.TituloSeccion}>Directorio Médico</Text>

                <TouchableOpacity style={styles.TituloSeccionFlechaBack}
                        onPress={() => navigation.goBack()}
                    >
                    <Image source={require('../assets/arrow-left.png')} style={styles.TituloSeccionFlechaBackImg} resizeMode="stretch" />
                </TouchableOpacity>

                <Text style={styles.labelPrincipalBody}>
                    Categorías
                </Text>

                {
                    dataMostrar.map((item) => {
                        return ( 
                            <React.Fragment key={item["directorio_categoria"]}>
                                <View style={styles.servicioMainContainer} >
                                    <TouchableOpacity onPress={() => navigation.navigate('DirectoriosDetalle', { idDetalle: item["directorio_categoria"] })}>
                                        <View style={styles.servicioMainContainerCol} >
                                            <View style={styles.servicioMainContainerRow} >
                                                <View style={styles.servicioMainContainerLeft}>
                                                    <Text style={styles.textoServicioTitulo}>{item["nombre"]}</Text>
                                                    <Text style={styles.textoServicioDescripcion}>{item["descripcion"]}</Text>
                                                </View>
                                                <View style={styles.servicioMainContainerRight}>
                                                    <View style={styles.servicioImgContainer}>
                                                        <Image source={{uri: UBYMED_WS_BASE + "img/" + item["img"]}} style={styles.servicioImgSM} resizeMode="contain" />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </React.Fragment>
                        );
                    })
                }

            </View>
        </ScrollView>
    );
}
