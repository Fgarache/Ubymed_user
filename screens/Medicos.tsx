
import * as React from 'react';

import {Component, useState, useEffect} from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, Button, Alert, ScrollView, Modal } from 'react-native';

import styles from "../styles";

import { AuthContext } from '../components/context.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

export default Medicos = ({ navigation, route }) => {
    const isFocused = useIsFocused();

    //request tipo POST hacia el API RestFul, request y response en formato JSON
    const [dataMostrar, setDataMostrar] = useState([]);

    const [titulo, setTitulo] = useState("");

    const {categoria} = route.params;

    const [headerImg, setHeaderImg] = useState(require('../assets/home_medicos.png'));
    const [headerColor, setHeaderColor] = useState({});
    const [headerTitulo, setHeaderTitulo] = useState('');

    useEffect(() => {
        if (isFocused) {
            switch (categoria) {
                case "1":
                    setHeaderImg(require('../assets/home_medicos.png'));
                    setHeaderTitulo('Médicos a domicilio');    
                    setHeaderColor(styles.homeImgBgMedicos);
                    break;
                case "2":
                    setHeaderImg(require('../assets/home_enfermero.png'));
                    setHeaderTitulo('Enfermería a domicilio');    
                    setHeaderColor(styles.homeImgBgEnf);
                    break;
                case "3":
                    setHeaderImg(require('../assets/home_ultrasonido.png'));
                    setHeaderTitulo('Ultrasonidos a domicilio');    
                    setHeaderColor(styles.homeImgBgUlt);
                    break;
                case "4":
                    setHeaderImg(require('../assets/home_fisioterapia.png'));
                    setHeaderTitulo('Fisioterapia a domicilio');    
                    setHeaderColor(styles.homeImgBgFis);
                    break;
                case "5":
                    setHeaderImg(require('../assets/home_ambulancia.png'));
                    setHeaderTitulo('Ambulancias a domicilio');    
                    setHeaderColor(styles.homeImgBgAmb);
                    break;
                default:
                    setHeaderImg(require('../assets/home_medicos.png'));
                    setHeaderTitulo('Médicos a domicilio');
                    setHeaderColor(styles.homeImgBgMedicos);
                    break;
            }

            fetch(global.UBYMED_WS_BASE + 'api/usuario', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: "getMedicosCategorias",
                    categoria: categoria,
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
                        setTitulo(responseJson["data"][0]["categoria_nombre"]);
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
        }
    }, [isFocused]);

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
              <Text style={styles.modalText}>Lo sentimos. En este momento no hay servicios médicos disponibles</Text>
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
                
                <View style={[styles.containerServiciosHeader, headerColor]}>
                    <Image source={headerImg} style={[styles.serviciosHeaderImg, headerColor]} resizeMode="stretch" />
                </View>
                <Text style={styles.TituloSeccion}>{headerTitulo}</Text>

                <TouchableOpacity style={styles.TituloSeccionFlechaBack}
                    onPress={() => navigation.goBack()}
                >
                    <Image source={require('../assets/arrow-left.png')} style={styles.TituloSeccionFlechaBackImg} resizeMode="stretch" />
                </TouchableOpacity>

                <Text style={styles.labelPrincipalBody}>
                    {titulo}
                </Text>

                {
                    dataMostrar.map((item) => {
                        return (
                            <React.Fragment key={item["medicos_categoria"]} >
                                    <View style={styles.servicioMainContainer} key={item["medicos_categoria"]}>
                                        <TouchableOpacity onPress={() => navigation.navigate('MedicosDetalle', { idDetalle: item["medicos_categoria"], categoria: categoria })}>
                                            <View style={styles.servicioMainContainerCol} >
                                                <View style={styles.servicioMainContainerRow} >
                                                    <View style={styles.servicioMainContainerLeft}>
                                                        <Text style={styles.textoServicioTitulo}>{item["nombre"]}</Text>
                                                        <Text style={styles.textoServicioDescripcion}>{item["descripcion"]}</Text>
                                                    </View>
                                                    <View style={styles.servicioMainContainerRight}>
                                                        <View style={styles.servicioImgContainer}>
                                                            <Image source={{uri: UBYMED_WS_BASE + "img/" + item["img"]}} style={styles.servicioImg} resizeMode="contain" />
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={styles.servicioMainContainerRow} >
                                                    <View style={styles.servicioMainContainerLeft}>
                                                        <Text style={styles.textoServicioNotaL}>15 - 30 min</Text>
                                                    </View>
                                                    <View style={styles.servicioMainContainerRight}>
                                                        <Text style={styles.textoServicioNotaR}>Q{(parseFloat(item["costo"]) + parseFloat(item["costo_servicio"])).toFixed(2)}</Text>
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
