
import * as React from 'react';

import {useRef, useState, useEffect} from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, Button, Alert, ScrollView, Linking } from 'react-native';

import styles from "../styles";

import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

import { AuthContext } from '../components/context.js';

import { useIsFocused } from '@react-navigation/core';

import useRecursiveTimeout from "../components/useRecursiveTimeout";

export default OrdenDetalle = ({ navigation, route }) => {
    const isFocused = useIsFocused();
    //request tipo POST hacia el API RestFul, request y response en formato JSON
    const [dataMostrar, setDataMostrar] = useState([]);
    const [estadoNombre, setEstadoNombre] = useState('');
    const [estadoColor, setEstadoColor] = useState('');
    const [checkEstado, setCheckEstado] = useState(true);


    const {idDetalle} = route.params;
    const {es_lab} = route.params;

    const [telefonoContacto, setTelefonoContacto] = useState('');


    const [localizacion, setLocalizacion] = useState({
        latitude: 14.522149,
        longitude: -90.577858,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    );

    const contactarnos = () => {
        var link = "https://wa.me/" + telefonoContacto;
        Linking.canOpenURL(link)
        .then(supported => {
            if (!supported) {
                Alert.alert('No hemos logrado abrir WhatsApp para que te pongas en contacto con nosotros, por favor, escribenos al número (502)40084336');
            } else {
                return Linking.openURL(link);
            }
        })
        .catch(err => console.error('An error occurred', err));
    }

    useEffect(() => {
        isFocused && fetch(global.UBYMED_WS_BASE + 'api/usuario', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: "getDetallesOrden",
                id: idDetalle,
                es_lab: es_lab,
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
                setDataMostrar(responseJson["data"]);
                setTelefonoContacto(responseJson["telefono"]);
                try {
                    let localizacionArray = responseJson["data"][0].geolocalizacion.split(", ");
                    setLocalizacion({
                        latitude: parseFloat(localizacionArray[0]),
                        longitude: parseFloat(localizacionArray[1]),
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    });
                } catch (error) {
                    
                }
                setEstadoNombre(responseJson["data"][0]["estado_nombre"]);
                setEstadoColor(responseJson["data"][0]["estado_color"]);
            } 
        }).catch((error) => {
            //escribir los errores serveros en la consola e informar al usuario
            console.error(error);
            Alert.alert("Ha ocurrido un error crítico, por favor, intentelo de nuevo más tarde");
        });
    }, [isFocused]);

    useRecursiveTimeout(async () => {
        fetch(global.UBYMED_WS_BASE + 'api/usuario', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: "getDetallesOrdenEstado",
                id: idDetalle,
                es_lab: es_lab,
            })
        }).then((response) => response.json())
        .then((responseJson) => {
            if(responseJson["error"] === true) {
                //error en las variables del request
                Alert.alert(responseJson["data"]);
            } else {
                //autenticación correcta
                setEstadoNombre(responseJson["data"][0]["estado_nombre"]);
                setEstadoColor(responseJson["data"][0]["estado_color"]);
            } 
        }).catch((error) => {
            //escribir los errores serveros en la consola e informar al usuario
            console.error(error);
            Alert.alert("Ha ocurrido un error crítico, por favor, intentelo de nuevo más tarde");
        });
    }, 4000);

    return (
        <ScrollView>
            {
                dataMostrar.map((item) => {
                    return (
                        <View style={styles.containerServicios} key={item["compra_medica"] + "-" + item["compra_lab"]}>
                            <View style={styles.containerServiciosHeader}>
                                <Image source={require('../assets/medicos_header.png')} style={styles.serviciosHeaderImg} resizeMode="stretch" />
                            </View>

                            <Text style={styles.TituloSeccion}>Detalle de Orden</Text>

                            <TouchableOpacity style={styles.TituloSeccionFlechaBack}
                                onPress={() => navigation.goBack()}
                            >
                                <Image source={require('../assets/arrow-left.png')} style={styles.TituloSeccionFlechaBackImg} resizeMode="stretch" />
                            </TouchableOpacity>

                            <Text style={styles.labelPrincipalBody}>ESTADO</Text>
                            <View style={styles.CardBoxSpaced}>
                                <Text style={styles.formularioTextInputDark}>{estadoNombre}</Text>
                                <View style={{ position: "absolute", right: 16, top: "40%", height: 16, width: 16, borderRadius: 8, backgroundColor: estadoColor,}}></View>
                            </View>

                            <Text style={styles.labelPrincipalBodySpaced}>GENERAL</Text>
                            <View style={styles.formularioContainer}>
                                <View style={styles.formularioInputContainer}>
                                    <View style={styles.FormularioRow}>
                                        <Text style={styles.FormTextLabelCompra}>ID de Orden</Text>
                                        <Text style={styles.FormTextLabelFlex}>{item["laboratorio"] === '0' ? "M" + item["compra_medica"] : "L" + item["compra_lab"]}</Text>
                                    </View>
                                </View> 
                                <View style={styles.formularioInputContainerLineSup}>
                                    <View style={styles.FormularioRow}>
                                        <Text style={styles.FormTextLabelCompra}>Fecha</Text>
                                        <Text style={styles.FormTextLabelFlex}>{item["created_at"].substring(8,10) + "/" + item["created_at"].substring(5,7) + "/" + item["created_at"].substring(0,4)}</Text>
                                    </View>
                                </View> 
                                <View style={styles.formularioInputContainerLineSup}>
                                    <View style={styles.FormularioRow}>
                                        <Text style={styles.FormTextLabelCompra}>Hora</Text>
                                        <Text style={styles.FormTextLabelFlex}>{item["created_at"].substring(11,16)}</Text>
                                    </View>
                                </View>
                            </View>


                            <Text style={styles.labelPrincipalBodySpaced}>DIRECCIÓN</Text>

                            
                            
                            <View style={styles.MapsContainer} >
                                <MapView style={styles.MapStyle}
                                    initialRegion={localizacion}
                                >
                                    <Marker draggable
                                        coordinate={{ latitude : localizacion.latitude , longitude : localizacion.longitude }}
                                    />
                                </MapView>
                            </View>



                            <View style={styles.CardBoxSpaced}>
                                <Text style={styles.formularioTextInput}>{item["lugar"]}</Text>
                            </View>
                            <View style={styles.CardBoxSpaced}>
                                <Text style={styles.formularioTextInput}>{item["direccion"]}</Text>
                            </View>

                            {
                                (es_lab === '1') ?
                                            <React.Fragment>
                                                <Text style={styles.labelPrincipalBodySpaced}>CORREO PARA ENVÍO DE RESULTADOS</Text>
                                                <View style={styles.CardBoxSpaced}>
                                                    <Text style={styles.formularioTextInput}>{item["correo"]}</Text>
                                                </View>
                                            </React.Fragment>
                                : <></>
                            }
                            


                            <Text style={styles.labelPrincipalBodySpaced}>DETALLES</Text>

                            <View style={styles.formularioContainer}>
                                <View style={styles.formularioInputContainer}>
                                    <View style={styles.FormularioRow}>
                                        <Text style={styles.FormTextLabelCompra}>{es_lab === '0' ? 'Plataforma Ubymed' : 'Toma de muestras'}</Text>
                                        <Text style={styles.FormTextLabelLight}>Q{item["costo_servicio"]}</Text>
                                    </View>
                                </View> 
                                {
                                    item["detalle"].map((detalle) => {
                                        return (
                                            <View style={styles.formularioInputContainerLineSup} key={detalle['nombre_servicio']}>
                                                <View style={styles.FormularioRow}>
                                                    <Text style={styles.FormTextLabelCompra}>{detalle['nombre_servicio']}</Text>
                                                    <Text style={styles.FormTextLabelLight}>Q{detalle["costo_servicio"]}</Text>
                                                </View>
                                            </View>
                                        );
                                    })
                                }
                            </View>

                            <View style={styles.formularioContainer}>
                                <View style={styles.formularioInputContainer}>
                                    <View style={styles.FormularioRow}>
                                        <Text style={styles.FormTextLabelBold}>TOTAL</Text>
                                        <Text style={styles.FormTextLabelLight}>Q{item["costo_total"]}</Text>
                                    </View>
                                </View>
                            </View>

                        </View>
                    );
                })
            }

            <TouchableOpacity style={styles.confirmarBtn} onPress={contactarnos} >
                <Text style={styles.confirmarBtnText} >Soporte</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}
