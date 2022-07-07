
import * as React from 'react';

import {useState, useEffect} from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, Modal, Platform, ScrollView, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import MapView from 'react-native-maps';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import * as Location from 'expo-location';

import styles from "../styles";

import { AuthContext } from '../components/context.js';

export default MedicosConfirmarCompra = ({ navigation, route }) => {
    //request tipo POST hacia el API RestFul, request y response en formato JSON
    const [dataMostrar, setDataMostrar] = useState([]);
    const [costoServicio, setCostoServicio] = useState(1000.00);
    const [costoTotal, setCostoTotal] = useState(0.00);
    const [nombre, setNombre] = useState('');
    const [numero, setNumero] = useState('');
    const [vencimiento, setVencimiento] = useState('');
    const [cvv, setCvv] = useState('');
    const [lugar, setLugar] = useState('');
    const [direccion, setDireccion] = useState('');
    const {idDetalle} = route.params;
    const {descripcion} = route.params;

    const [facturaNombre, setFacturaNombre] = useState('');
    const [facturaNit, setFacturaNit] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalText, setModalText] = useState('');

    const [registroExitoso, setRegistroExitoso] = useState(0);

    const [espacioIOS, setEspacioIOS] = useState(0);

    const loginContext = React.useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    
    const [localizacion, setLocalizacion] = useState({
        latitude: 14.613734,
        longitude: -90.534755,
        latitudeDelta: 0.006,
        longitudeDelta: 0.004,
      }
    );

    const _getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setShowModal(true);
            setModalTitle('¡Advertencia!');
            setModalText("No ha otorgado los permisos necesarios para obtener su posición actual.");
        }

        let userLocation = null;
        try {
            userLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.BestForNavigation,
                LocationActivityType: Location.ActivityType.OtherNavigation,
                maximumAge: 5000,
                timeout: 15000,
            });
        } catch {
            userLocation = await Location.getLastKnownPositionAsync({
                accuracy: Location.Accuracy.BestForNavigation,
                LocationActivityType: Location.ActivityType.OtherNavigation,
                maxAge: 5000,
                timeout: 15000,
            });
        }

        try {
            //let userLocation = await Location.getCurrentPositionAsync({accuracy: /*Location.LocationAccuracy.High*/ 6 });
            setLocalizacion({
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
                latitudeDelta: 0.006,
                longitudeDelta: 0.004,
              });
        } catch (error) {
            console.log(error);
            console.log(await Location.getProviderStatusAsync());
            setShowModal(true);
            setModalTitle('¡Error!');
            setModalText("Ha ocurrido un error al intentar obtener la posición actual.");
        }
    }

    useEffect(() => {
        fetch(global.UBYMED_WS_BASE + 'api/usuario', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: "getMedicosCategoriaDetalle",
                id: idDetalle,
            })
        }).then((response) => response.json())
        .then((responseJson) => {
            if(responseJson["error"] === true) {
                //error en las variables del request
                setShowModal(true);
                setModalTitle('¡Error!');
                setModalText(responseJson["data"]);
            } else {
                setDataMostrar(responseJson["data"]);
                setCostoServicio(parseFloat(responseJson["data"][0]["costo_servicio"]));
                setCostoTotal(parseFloat(responseJson["data"][0].costo) + parseFloat(responseJson["data"][0]["costo_servicio"]));
            } 
        }).catch((error) => {
            //escribir los errores serveros en la consola e informar al usuario
            console.error(error);
            setShowModal(true);
            setModalTitle('¡Error!');
            setModalText("Ha ocurrido un error crítico, por favor, intentelo de nuevo más tarde.");
        });

        //obtener la localización actual...
        _getLocation();

    }, []);

    // takes the form field value and returns true on valid number
    const validarTarjeta = (value: string) => {
        if (/[^0-9-\s]+/.test(value)) return false;
        var nCheck = 0, nDigit = 0, bEven = false;
        value = value.replace(/\D/g, "");
    
        for (var n = value.length - 1; n >= 0; n--) {
            var cDigit = value.charAt(n),
                nDigit = parseInt(cDigit, 10);
            if (bEven) {
                if ((nDigit *= 2) > 9) nDigit -= 9;
            }
            nCheck += nDigit;
            bEven = !bEven;
        }
        return (nCheck % 10) == 0;
    }

    const validarVencimiento = (value) => {
        if (value && value.length === 5) {
            //try {
                let arrayFecha = value.split("/");
                if (arrayFecha.length == 2) {
                    let cadenaTarjeta = arrayFecha[1] + "-" + arrayFecha[0];
                    let cadenaFecha = new Date().toISOString().substr(2, 5).replace('T', ' ');
                    return cadenaTarjeta >= cadenaFecha;
                }
            //} catch (error) {
            //}
        }
        return false;
    }

    const espaciarTarjeta = (value) => {
        let nuevoNumero = "";
        value = value.replace(/ /g, "").substring(0,16);
        //concatenar solo números
        for (var i = 0; i < value.length; i++) {
            let numero = value.charAt(i);
            if (numero !== " " && !isNaN(numero) && i < 16) {
                nuevoNumero += numero;
            }
        }
        //agregar espacios...
        let numeroFinal = "";
        for (var i = 0; i < nuevoNumero.length; i++) {
            if ((i+1) % 4 === 0 && (i+1) < nuevoNumero.length) {
                numeroFinal += nuevoNumero.charAt(i) + " ";
            } else {
                numeroFinal += nuevoNumero.charAt(i);
            }
        }
        return numeroFinal;
    }

    const confirmarCompra = () => {
        setLoading(true);
        //validar la tarjeta...
        if (!validarTarjeta(numero.replace(/ /g, ""))) {
            setLoading(false);
            setShowModal(true);
            setModalTitle('¡Error!');
            setModalText("El número de tarjeta es inválido, verifique la información de su tarjeta.");
        } else if (!cvv || cvv.length !== 3) {
            setLoading(false);
            setShowModal(true);
            setModalTitle('¡Error!');
            setModalText("El CVV es incorrecto.");
        } else if (!validarVencimiento(vencimiento)) {
            setLoading(false);
            setShowModal(true);
            setModalTitle('¡Error!');
            setModalText("La fecha de vencimiento no es válida.");
        } else if (!lugar || !direccion || !nombre){
            setLoading(false);
            setShowModal(true);
            setModalTitle('¡Error!');
            setModalText("Por favor, ingrese toda la información solicitada.");
        } else {
            fetch(global.UBYMED_WS_BASE + 'api/usuario', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: "generarCompraMedica",
                    usuario: loginContext.userData.usuario,
                    servicios: idDetalle,
                    descripcion: descripcion,
                    lugar: lugar,
                    direccion: direccion,
                    tarjetaNombre: nombre,
                    tarjetaNumero: numero.replace(/ /g, ""),
                    tarjetaVencimiento: vencimiento,
                    tarjetaCvv: cvv,
                    costoServicio: costoServicio,
                    costoTotal: costoTotal,
                    costoMedico: dataMostrar[0].costo,
                    geolocalizacion: localizacion.latitude + ", " + localizacion.longitude,
                    factura_nombre: facturaNombre,
                    factura_nit: facturaNit,
                })
            }).then((response) => response.json())
            .then((responseJson) => {
                setLoading(false);
                if(responseJson["error"] === true) {
                    setShowModal(true);
                    setModalTitle('¡Error!');
                    setModalText(responseJson["data"]);
                    console.log(responseJson["data"]);
                    console.log(responseJson["dataArray"]);
                    console.log(responseJson["dataParams"]);
                } else {
                    setRegistroExitoso(1);
                    setShowModal(true);
                    setModalTitle('¡Orden Aceptada!');
                    setModalText('Puedes revisar el estado y detalles en la sección de órdenes');
                } 
            }).catch((error) => {
                //escribir los errores serveros en la consola e informar al usuario
                console.error(error);
                setLoading(false);
                setShowModal(true);
                setModalTitle('¡Error!');
                setModalText("Ha ocurrido un error crítico, por favor, intentelo de nuevo más tarde.");
            });
        }
    }


    /*
    OCULTAR DETALLES DE COMPRA...
    <Text style={styles.labelPrincipalBodySpaced}>DETALLES</Text>
                <View style={styles.formularioContainer}>
                    <View style={styles.formularioInputContainer}>
                        <View style={styles.FormularioRow}>
                            <Text style={styles.FormTextLabelCompra}>Honorarios Médicos</Text>
                            <Text style={styles.FormTextLabelLight}>Q{(dataMostrar.length > 0) ? dataMostrar[0].costo : ''}</Text>
                        </View>
                    </View>
                    <View style={styles.formularioInputContainerLineSup}>
                        <View style={styles.FormularioRow}>
                            <Text style={styles.FormTextLabelCompra}>Plataforma Ubymed</Text>
                            <Text style={styles.FormTextLabelLight}>Q{costoServicio}.00</Text>
                        </View>
                    </View>
                </View>
    */

    return (


<KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <React.Fragment>
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
              <Text style={styles.modalTitleText}>{modalTitle}</Text>
              <Text style={styles.modalText}>{modalText}</Text>
            <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                    if (registroExitoso === 1) {
                        navigation.navigate('Ordenes');
                        setShowModal(!showModal);
                    } else {
                        setShowModal(!showModal);
                    }
                }}
            >
                <Text style={styles.textStyle}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <ScrollView style={{marginBottom: espacioIOS,}}>
            <View style={styles.containerServicios}>
                <View style={styles.containerServiciosHeader}>
                    <Image source={require('../assets/medicos_header.png')} style={styles.serviciosHeaderImg} resizeMode="stretch" />
                </View>

                <Text style={styles.TituloSeccion}>Confirmar Compra</Text>

                <TouchableOpacity style={styles.TituloSeccionFlechaBack}
                    onPress={() => navigation.goBack()}
                >
                    <Image source={require('../assets/arrow-left.png')} style={styles.TituloSeccionFlechaBackImg} resizeMode="stretch" />
                </TouchableOpacity>

                <Text style={styles.labelPrincipalBody}>DIRECCIÓN</Text>

                <View style={styles.MapsContainer} >
                    <MapView style={styles.MapStyle}
                           initialRegion={localizacion}
                           onRegionChangeComplete={(localizacion) => setLocalizacion(localizacion)}
                           zoomEnabled={true}
                            scrollEnabled={true}
                            showsScale={true} 
                            region={localizacion}
                    >
                    </MapView>
                    <Image source={require('../assets/map_marker.png')} style={styles.mapMarker} resizeMode="stretch" />
                </View>
 

                <View style={styles.CardBoxSpaced}>
                    <View style={[styles.formularioInputContainer, styles.TextLoginForm]}>
                        <TextInput
                            style={styles.formularioTextInput}
                            placeholder="Lugar"
                            placeholderTextColor="#BDBDBD"
                            onChangeText={(lugar) => setLugar(lugar)}
                        />
                    </View>
                </View>
                <View style={styles.CardBoxSpaced}>
                    <View style={styles.formularioInputContainer}>
                        <TextInput
                            style={styles.formularioTextInput}
                            placeholder="Dirección"
                            placeholderTextColor="#BDBDBD"
                            onChangeText={(direccion) => setDireccion(direccion)}
                        />
                    </View>
                </View>

            

                <Text style={styles.labelPrincipalBodySpaced}>SERVICIO MÉDICO</Text>
                <View style={styles.formularioContainer}>
                    <View style={styles.formularioInputContainer}>
                        <View style={styles.FormularioRow}>
                            <Text style={styles.FormTextLabel}>{(dataMostrar.length > 0) ? dataMostrar[0].nombre : '---'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.formularioContainer}>
                    <View style={styles.formularioInputContainer}>
                        <View style={styles.FormularioRow}>
                            <Text style={styles.FormTextLabelBold}>TOTAL</Text>
                            <Text style={styles.FormTextLabelLight}>Q{ parseFloat(costoTotal + "").toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.labelPrincipalBodySpaced}>DATOS DE FACTURA</Text>
                <View style={styles.formularioContainer}>
                    <View style={styles.formularioInputContainer}>
                        <View style={styles.FormularioRow}>
                            <Text style={styles.FormTextLabel}>Nombre</Text>
                            <TextInput
                                style={styles.FormTextInput}
                                placeholder="Nombre"
                                placeholderTextColor="#BDBDBD"
                                onChangeText={(newValue) => setFacturaNombre(newValue)}
                            />
                        </View>
                    </View>
                    <View style={styles.formularioInputContainerLineSup}>
                        <View style={styles.FormularioRow}>
                            <Text style={styles.FormTextLabel}>NIT</Text>
                            <TextInput 
                                style={styles.FormTextInput}
                                placeholder="NIT"
                                placeholderTextColor="#BDBDBD"
                                onChangeText={(newValue) => setFacturaNit(newValue)}
                            />
                        </View>
                    </View>
                </View> 

                <Text style={styles.labelPrincipalBodySpaced}>TARJETA DE CRÉDITO / DÉBITO</Text>
                <View style={styles.formularioContainer}>
                    <View style={styles.formularioInputContainer}>
                        <View style={styles.FormularioRow}>
                            <Text style={styles.FormTextLabel}>Nombre en la tarjeta</Text>
                            <TextInput
                                style={styles.FormTextInput}
                                placeholder="Nombre"
                                placeholderTextColor="#BDBDBD"
                                onChangeText={(nombre) => setNombre(nombre)}
                            />
                        </View>
                    </View>
                    <View style={styles.formularioInputContainerLineSup}>
                        <View style={styles.FormularioRow}>
                            <View style={styles.FormTextLabel}>
                                <Image source={require('../assets/icono_tarjeta.png')} style={styles.IconoTarjeta} resizeMode="stretch" />
                            </View>
                            <TextInput
                                style={styles.FormTextInput}
                                placeholder="Número de tarjeta"
                                placeholderTextColor="#BDBDBD"
                                onChangeText={(numero) => setNumero(espaciarTarjeta(numero))}
                                value={numero}
                            />
                        </View>
                    </View>
                    <View style={styles.formularioInputContainerLineSup}>
                        <View style={styles.FormularioRow}>
                            <Text style={styles.FormTextLabel}>Vencimiento</Text>
                            <TextInput 
                                style={styles.FormTextInput}
                                placeholder="MM/AA"
                                placeholderTextColor="#BDBDBD"
                                onChangeText={(vencimiento) => setVencimiento(vencimiento)}
                            />
                        </View>
                    </View>
                    <View style={styles.formularioInputContainerLineSup}>
                        <View style={styles.FormularioRow}>
                            <Text style={styles.FormTextLabel}>CVV</Text>
                            <TextInput 
                                style={styles.FormTextInput}
                                placeholder="Número"
                                placeholderTextColor="#BDBDBD"
                                onChangeText={(cvv) => setCvv(cvv)}
                            />
                        </View>
                    </View>
                </View> 


                <TouchableOpacity style={styles.confirmarBtn} onPress={confirmarCompra} >
                    <Text style={styles.confirmarBtnText} >Confirmar compra</Text>
                </TouchableOpacity>



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

        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>


    );
}
