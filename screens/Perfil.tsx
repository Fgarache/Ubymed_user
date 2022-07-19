
import * as React from 'react';

import {Component, useState, useEffect} from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, Modal, Alert, ScrollView, Keyboard, TouchableWithoutFeedback, Platform, KeyboardAvoidingView, } from 'react-native';
//import {Picker} from '@react-native-picker/picker';

import styles from "../styles";

import { AuthContext } from '../components/context.js';
import { Picker } from '@react-native-picker/picker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as varG from "../components/varG";


export default Perfil = ({ navigation, route }) => {

    const loginContext = React.useContext(AuthContext);
    if (loginContext.isLogged !== true){
        navigation.navigate('Login');
        return (<View></View>);
    }

    const [nombre, setNombre] = useState(loginContext.userData.nombres);
    const [apellido, setApellido] = useState(loginContext.userData.apellidos);
    const [sexo, setSexo] = useState(loginContext.userData.sexo == 1 ? "M" : "F");
    const [fechaNacimiento, setFechaNacimiento] = useState(loginContext.userData.fecha_nacimiento.substring(8,10) + "/" + loginContext.userData.fecha_nacimiento.substring(5,7) + "/" + loginContext.userData.fecha_nacimiento.substring(0,4));

    const [telefono, setTelefono] = useState(loginContext.userData.telefonos);
    const [email, setEmail] = useState(loginContext.userData.email);
    const [DPI, setDPI] = useState(loginContext.userData.DPI);

    const [emailc, setEmailc] = useState('');
    const [passwd, setPasswd] = useState('');
    const [passwdc, setPasswdc] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalText, setModalText] = useState('');

    const [TextFE, setTextFE] = useState("Validar datos de Beneficiencia Española");
    
    const Validar = ()=>{
        if (varG.estado === "false"){
            navigation.navigate('LoginPilar', { })
        }
        else {
            setTextFE("Estado de Usuario Activo DPI: "+varG.DPI)
        }
    }
   

    useEffect(() => {
        if (varG.estado === "false"){
        }else{
            setTextFE("Estado de Usuario Activo DPI: "+varG.DPI)
        }
        
    });

    const storeData = async (value) => {
        try {
            if (value) await AsyncStorage.setItem('auth_user', value)
        } catch (e) {
            Alert.alert("Error al guardar la información de la sesión.");
        }
    }

    const registrar = () => {
        var fechaNac;
        var dpi;
        var pas;
        
        const validarDpi =()=>{
            if (DPI.length === 9 && isNaN(DPI)===true){
                pas = true;
            }else{
                pas = false;
            }
            if (DPI.length === 13 && isNaN(DPI)===false){
                dpi = true;
            }else{
                dpi = false;
            }
        }
        validarDpi()
        if ( dpi === pas){
            setShowModal(true);
            setModalTitle("¡Error!");
            setModalText("DPI o Pasaporte incorrecto ");
            return null;  
        }
        if (fechaNacimiento.length < 10) {
            setShowModal(true);
            setModalTitle("¡Error!");
            setModalText("La fecha de nacimiento es incorrecta, por favor, ingrese la fecha en el formato indicado.");
            return null;
        }
        try {
            fechaNac = fechaNacimiento.substring(6,10) + "-" + fechaNacimiento.substring(3,5) + "-" + fechaNacimiento.substring(0,2);
            var f = new Date(fechaNac)
        } catch (error) {
            setShowModal(true);
            setModalTitle("¡Error!");
            setModalText("La fecha de nacimiento es incorrecta, por favor, ingrese la fecha en el formato indicado.");
        }
        if (sexo !== "M" && sexo !== "F") {
            setShowModal(true);
            setModalTitle("¡Error!");
            setModalText("El sexo ingresado es inválido, por favor, ingrese M o F.");
            return null;
        }

        //request tipo POST hacia el API RestFul, request y response en formato JSON
        if (!nombre || !apellido || !sexo || !fechaNacimiento || !telefono || !email) {
            setShowModal(true);
            setModalTitle("¡Error!");
            setModalText("Por favor, llenar todos los espacios obligatorios (*)");
            return null;
        } if (passwd.length > 0 && passwd !== passwdc) {
            setShowModal(true);
            setModalTitle("¡Error!");
            setModalText("Las contraseñas no coinciden.");
            return null;
        } else {
            if (passwd.length < 1) {
                setPasswd('');
            }
            fetch(global.UBYMED_WS_BASE + 'api/usuario', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: "updateUsuario",
                    nombres: nombre,
                    apellidos: apellido,
                    sexo: (sexo === 'F' ? 2 : 1),
                    fecha_nacimiento: fechaNac,
                    telefonos: telefono,
                    email: email,
                    passwd: passwd,
                    DPI : DPI,
                })
            }).then((response) => response.json())
            .then((responseJson) => {
                if(responseJson["error"] === true) {
                    //error en las variables del request
                    setShowModal(true);
                    setModalTitle("¡Error!");
                    setModalText(responseJson["data"]);
                    console.log(responseJson["data"]);
                } else {
                    setShowModal(true);
                    setModalTitle('¡Operación correcta!');
                    setModalText('Se ha actualizado la información correctamente.');
                    if (responseJson["dataUsuario"]) {
                        loginContext.userData = responseJson["dataUsuario"];
                        storeData(JSON.stringify(loginContext));
                    }
                } 
            }).catch((error) => {
                //escribir los errores serveros en la consola e informar al usuario
                console.error(error);
                setShowModal(true);
                setModalTitle("¡Error!");
                setModalText("Ha ocurrido un error crítico, por favor, intentelo de nuevo más tarde");
            });
        }
    }

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
                    setShowModal(!showModal);
                }}
            >
                <Text style={styles.textStyle}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


        <ScrollView>
            <View style={styles.containerServicios}>
                <View style={styles.containerServiciosHeader}>
                    <Image source={require('../assets/header_registro.png')} style={styles.serviciosHeaderImg} resizeMode="stretch" />
                </View>

                <Text style={styles.TituloSeccion}>Actualizar mi perfil</Text>

                <TouchableOpacity style={styles.TituloSeccionFlechaBack}
                    onPress={() => navigation.goBack()}
                >
                    <Image source={require('../assets/arrow-left.png')} style={styles.TituloSeccionFlechaBackImg} resizeMode="stretch" />
                </TouchableOpacity>

                <Text style={styles.labelPrincipalBodySpaced}>
                    DATOS GENERALES
                </Text>
                <View style={styles.formularioContainer}>
                    <View style={styles.formularioInputContainer}>
                        <View style={styles.FormularioRow}>
                            <Text style={styles.FormTextLabel}>Nombre</Text>
                            <TextInput
                                style={styles.FormTextInput}
                                placeholder="Nombre"
                                placeholderTextColor="#BDBDBD"
                                onChangeText={(nombre) => setNombre(nombre)}
                                value={nombre}
                            />
                        </View>
                    </View>
                    <View style={styles.formularioInputContainerLineSup}>
                        <View style={styles.FormularioRow}>
                            <Text style={styles.FormTextLabel}>Apellido</Text>
                            <TextInput 
                                style={styles.FormTextInput}
                                placeholder="Apellido"
                                placeholderTextColor="#BDBDBD"
                                onChangeText={(apellido) => setApellido(apellido)}
                                value={apellido}
                            />
                        </View>
                    </View>
                    <View style={styles.formularioInputContainerLineSupLibreSexo}>
                        <View style={styles.FormularioRow}>
                            <Text style={styles.FormTextLabel}>Sexo</Text>
                            <View style={styles.FormTextInputSexo}>
                                <Picker
                                    style={styles.FormTextInputSexoPicker}
                                    itemStyle={styles.FormTextInputSexoItem}
                                    selectedValue={sexo}
                                    onValueChange={(itemValue, itemIndex) => setSexo(itemValue) }>
                                    <Picker.Item label='F' value='F' />
                                    <Picker.Item label='M' value='M' />
                                    
                                </Picker>
                            </View>
                        </View>
                    </View>
                    <View style={styles.formularioInputContainerLineSup}>
                        <View style={styles.FormularioRow}>
                            <Text style={styles.FormTextLabel}>Fecha de nacimiento</Text>
                            <TextInput 
                                style={styles.FormTextInput}
                                placeholder="DD/MM/AAAA"
                                placeholderTextColor="#BDBDBD"
                                onChangeText={(fechaNacimiento) => setFechaNacimiento(fechaNacimiento)}
                                defaultValue={ fechaNacimiento }
                            />
                        </View>
                    </View>

                    <View style={styles.formularioInputContainerLineSup}>
                        <View style={styles.FormularioRow}>
                            <Text style={styles.FormTextLabel}>DPI - Pasaporte</Text>
                            <TextInput
                                style={styles.FormTextInput}
                                placeholder="DPI"
                                placeholderTextColor="#BDBDBD"
                                onChangeText={(DPI) => setDPI(DPI)}
                                value={DPI}
                            />
                        </View>
                    </View>
                </View>

                

                <Text style={styles.labelPrincipalBodySpaced}>
                    CONTACTO
                </Text>
                <View style={styles.formularioContainer}>
                    <View style={styles.formularioInputContainer}>
                        <View style={styles.FormularioRow}>
                            <Text style={styles.FormTextLabel}>Número de teléfono</Text>
                            <TextInput
                                style={styles.FormTextInput}
                                placeholder="XXXX-XXXX"
                                placeholderTextColor="#BDBDBD"
                                onChangeText={(telefono) => setTelefono(telefono)}
                                value={telefono}
                            />
                        </View>
                    </View>
                    <View style={styles.formularioInputContainerLineSup}>
                        <View style={styles.FormularioRow}>
                            <Text style={styles.FormTextLabel}>Email</Text>
                            <Text style={styles.FormTextInput}>{email}</Text>
                        </View>
                    </View>
                    <View style={styles.formularioInputContainerLineSup}>
                        <View style={styles.FormularioRow}>
                            <Text style={styles.FormTextLabel}>Contraseña</Text>
                            <TextInput
                                style={styles.FormTextInput}
                                placeholder="**********"
                                placeholderTextColor="#BDBDBD"
                                secureTextEntry={true}
                                onChangeText={(passwd) => setPasswd(passwd)}
                            />
                        </View>
                    </View>
                    <View style={styles.formularioInputContainerLineSup}>
                        <View style={styles.FormularioRow}>
                            <Text style={styles.FormTextLabel}>Confirmar contraseña</Text>
                            <TextInput
                                style={styles.FormTextInput}
                                placeholder="**********"
                                placeholderTextColor="#BDBDBD"
                                secureTextEntry={true}
                                onChangeText={(passwd) => setPasswdc(passwd)}
                            />
                        </View>
                    </View>
                </View>

                <Text style={styles.labelPrincipalBodySpaced}>
                    LABORATORIO EL PILAR
                </Text>
                <View style={styles.formularioContainer}>
                    <View style={styles.formularioInputContainer}>
                    <TouchableOpacity onPress={() => Validar()} >
                    <Text style={styles.FormTextLabel} >{TextFE}</Text>
                </TouchableOpacity>
                    </View>
                </View>
                
                

                <TouchableOpacity style={styles.registroBtn} onPress={registrar} >
                    <Text style={styles.registroBtnText} >Actualizar</Text>
                </TouchableOpacity>
               
                
            </View>
        </ScrollView>
        </React.Fragment>

        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>


    );
}
