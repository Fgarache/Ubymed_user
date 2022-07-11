
import * as React from 'react';

import {useRef, useState, useEffect} from 'react';
import { Platform, Text, View, Dimensions, TouchableOpacity, Image, ImageBackground, Alert, ScrollView, Modal, TextInput, Button } from 'react-native';
import Carousel from 'react-native-anchor-carousel';
import * as varG from "../components/varG";
import styles from "../styles";


/*
 APP HOME
 */

import { AuthContext } from '../components/context.js';

const {width: windowWidth} = Dimensions.get('window');

import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default Labs = ({ navigation, route, screenProps }) => {
    //request tipo POST hacia el API RestFul, request y response en formato JSON
    const [laboratorios, setLaboratorios] = useState([]);
    const [laboratoriosData, setLaboratoriosData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [msjVeneficiencia, setMsjVeneficiencia] = useState ("Registrar usuario de Laboratorios el Pilar para aplicar a descuentos de Beneficiencia Española.")
    const [text, onChangeText] = React.useState("");


    function mapItems(items){
        return items.map((value, i) => ({key: i.toString(), value}));
    }
    const Validar = ()=>{
        if (varG.estado === "false"){
            navigation.navigate('LoginPilar', { })
        }else if (varG.estado === undefined){
            varG.estado="false"
            Validar()
        }
        else {
            setMsjVeneficiencia("")
        }
    }

    function renderItem({item, index}) {
        const {laboratorio, nombre_detalle, nombre, horario_str, tiempo_estimado, img} = item;
        return (
            <View style={styles.servicioMainContainerLabsSup} key={laboratorio}>
                <View style={styles.servicioMainContainerLabs} >
                    <TouchableOpacity style={{height: "100%",}} onPress={() => navigation.navigate('LabsDetalle', { idDetalle: laboratorio,  })}>
                        <View style={styles.LabsMainInnerContainer}>
                            <View style={styles.labsSeccionDescripcion}>
                                <Text style={styles.textoServicioTituloLabs}>{nombre + " " + nombre_detalle}</Text>
                                <Text style={styles.textoServicioDescripcionLabs}>
                                    <Text>{horario_str}</Text>
                                    <Text>
                                        {Array(84 - horario_str.length).join(' ').substring(0, 84 - horario_str.length)}
                                    </Text>
                                </Text>
                                <Text style={styles.textoServicioNotaLabs}>{tiempo_estimado}</Text>
                            </View>
                            <View style={styles.labsSeccionImagenLabs}>
                                <View style={styles.servicioImgContainerLabsDet}>
                                    <Image source={{uri: UBYMED_WS_BASE + "img/" + img}} style={styles.servicioImgLabLabs} resizeMode="stretch" />
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const renderLaboratorios = () =>{
        var data = laboratorios;
        //console.log(JSON.stringify(data));
        //Alert.alert(JSON.stringify(data));
        return laboratorios.map((item) => {
            return (
                <React.Fragment key={item["nombre"]}>
                    <Text style={styles.labelPrincipalBodySpaced}>
                        {item["nombre"]}
                    </Text>
                    {
                        (item["detalle"].length > 1) ?
                                <Carousel
                                data={item["detalle"]}
                                renderItem={renderItem}
                                itemWidth={0.85 * windowWidth}
                                inActiveOpacity={1}
                                containerWidth={windowWidth}
                                inactiveSlideScale={1}
                            />
                        : 
                        <View style={styles.labsContainerIndividual}>
                            <View style={styles.servicioMainContainerLabs} key={item["detalle"][0]["laboratorio"]}>
                                <TouchableOpacity style={{height: "100%",}} onPress={() => navigation.navigate('LabsDetalle', { idDetalle: item["detalle"][0]["laboratorio"],  })}>
                                    <View style={styles.LabsMainInnerContainer}>
                                        <View style={styles.labsSeccionDescripcion}>
                                            <Text style={styles.textoServicioTituloLabs}>{item["detalle"][0]["nombre"] + " " + item["detalle"][0]["nombre_detalle"]}</Text>
                                            <Text style={styles.textoServicioDescripcionLabs}>
                                                <Text>{item["detalle"][0]["horario_str"]}</Text>
                                                <Text>
                                                    {Array(84 - item["detalle"][0]["horario_str"].length).join(' ').substring(0, 84 - item["detalle"][0]["horario_str"].length)}
                                                </Text>
                                            </Text>
                                            <Text style={styles.textoServicioNotaLabs}>{item["detalle"][0]["tiempo_estimado"]}</Text>
                                        </View>
                                        <View style={styles.labsSeccionImagenLabs}>
                                            <View style={styles.servicioImgContainerLabsDet}>
                                                <Image source={{uri: UBYMED_WS_BASE + "img/" + item["detalle"][0]["img"]}} style={styles.servicioImgLabLabs} resizeMode="stretch" />
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
             </React.Fragment>
            );
        });
    }

    const _getLocationYLabs = async () => {
        let userLocation = null;      
        let { status } = await Location.requestForegroundPermissionsAsync();
        if(userLocation == null) {
           // Alert.alert("Hubo un error al obtener la localización actual");
        }

        fetch(global.UBYMED_WS_BASE + 'api/usuario', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: "listarLaboratoriosAgrupados",
                geolocalizacion: (userLocation !== null) ? userLocation.coords.latitude + ", " + userLocation.coords.longitude : "",
            })
        }).then((response) => response.json())
        .then((responseJson) => {
            setLoading(false);
            if(responseJson["error"] === true) {
                //error en las variables del request
                Alert.alert(responseJson["data"]);
            } else if(responseJson["auth"] === false) {
                //error de autenticación
                Alert.alert(responseJson["data"]);
            } else {
                //autenticación correcta
                if (responseJson["data"].length > 0) {
                    setLaboratorios(responseJson["data"]);
                    var position = 0
                    if (varG.estado==="false"){
                        var labs = responseJson["data"]
                        for(var i=0;labs.length>i;i++){
                            if(labs[i].detalle[0].nombre === "Laboratorio Clínico El Pilar"){
                            for(var j=0;labs[position].detalle.length>j;j++){
                                if(labs[position].detalle[j].nombre_detalle === "Pacientes Beneficencia Española"){
                                labs[position].detalle.splice(j, i);     
                                setLaboratorios(labs)
                                i = labs.length
                                j = labs[position].detalle.length
                                }else{
                                    setLaboratorios(responseJson["data"])
                                    setLaboratoriosData(responseJson["data"])
                                }
                            }
                            }else{
                                setLaboratorios(responseJson["data"])
                            }
                            position= position+1;
                        }    
                    }else{
                        setLaboratorios(responseJson["data"])
                        setLaboratoriosData(responseJson["data"])

                    }
                    
                } else {
                    setShowModal(true);
                }
            } 
        }).catch((error) => {
            //escribir los errores serveros en la consola e informar al usuario
            console.error(error);
            Alert.alert("Ha ocurrido un error crítico, por favor, intentelo de nuevo más tarde");
        });
    }

    const searchFilterFunction = (text) => {
        if(text){            
            const newData = laboratoriosData.filter(item => {
                const itemData = item.nombre ? item.nombre.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            })
            //alert(newData)
            setLaboratorios(newData);
        } else {
            setLaboratorios(laboratoriosData);
        }
    }
    const handleChange=e=>{
        searchFilterFunction(text)
    }

    useEffect(() => {
        verificarPrimerUso();
        _getLocationYLabs();
        if (varG.estado === "false"){
        }else{
            setMsjVeneficiencia("")
        }        
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
        <React.Fragment>

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
              <Text style={styles.modalText}>Lo sentimos. En este momento no hay laboratorios disponibles</Text>
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

            <ScrollView>
                <View style={styles.containerServicios}>
                    <View style={styles.containerServiciosHeaderLabs}>
                        <Image source={require('../assets/home_laboratorios.png')} style={[styles.serviciosHeaderImg, styles.homeImgBgLab]} resizeMode="stretch" /> 
                    </View>
                    <Text style={styles.TituloSeccion}>Laboratorios</Text>
                        <TouchableOpacity onPress={() =>  Validar()}>                       
                        <Text style = {styles.labCarboxText}>{msjVeneficiencia}</Text>
                        </TouchableOpacity>
                        <View style={styles.CardBox2}>
                            <View style={styles.formularioInputContainer2}>
                            <TextInput
                            style={styles.formularioTextInput}
                            placeholder="Buscar..."
                            placeholderTextColor="#BDBDBD"
                            autoCapitalize='none'
                            onChangeText={onChangeText} 
                            onChange={handleChange}
                            value={text}
                            
                            />
                            </View>
                        </View>

                    <TouchableOpacity style={styles.TituloSeccionFlechaBack}
                        onPress={() => navigation.goBack()}
                    >
                        <Image source={require('../assets/arrow-left.png')} style={styles.TituloSeccionFlechaBackImg} resizeMode="stretch" />
                    </TouchableOpacity>
                    { renderLaboratorios() }
                    <Text style={styles.labelPrincipalBodySpaced}></Text>
                    <Text style={styles.labelPrincipalBodySpaced}></Text>
                </View>
            </ScrollView>
            {
                (loading) ?
                        <View style={styles.loadingGifContainer}>
                            <View style={styles.loadingGifContainerImg}>
                                <Image source={require('../assets/loading.gif')} style={styles.loadingGif} resizeMode="stretch" />
                            </View>
                        </View>
                : <></>
            }
        </React.Fragment>
    );
}
