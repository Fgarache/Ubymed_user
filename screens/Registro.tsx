
import * as React from 'react';

import {Component, useState, useEffect} from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, Modal, ScrollView, Linking, Alert, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard} from 'react-native';


import styles from "../styles";

import UCheckbox from '../components/UCheckbox';

import { AuthContext } from '../components/context.js';
import { Picker } from '@react-native-picker/picker';

export default Registro = ({ navigation, route }) => {

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [sexo, setSexo] = useState(1 ? "M" : "F");
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [DPI, setDPI] = useState('');

    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [emailc, setEmailc] = useState('');
    const [passwd, setPasswd] = useState('');
    const [passwdc, setPasswdc] = useState('');

    const [aceptartp, setAceptartp] = useState(false);

    const loginContext = React.useContext(AuthContext);

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalText, setModalText] = useState('');

    const [registroExitoso, setRegistroExitoso] = useState(0);


    const registrar = () => {
        var fechaNac;
    

        if (DPI.length < 13){
            setShowModal(true);
            setModalTitle("¡Error!");
            setModalText("DPI incorrecto.");
            return null;
        }



        if (!aceptartp) {
            setShowModal(true);
            setModalTitle("¡Advertencia!");
            setModalText("Debes de leer y aceptar los terminos y condiciones y las políticas de privacidad.");
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
            return null;
        }

        

        //request tipo POST hacia el API RestFul, request y response en formato JSON
        if (!nombre || !apellido || !sexo  || !fechaNacimiento || !telefono || !email || !emailc || !passwd || !passwdc) {
            setShowModal(true);
            setModalTitle("¡Error!");
            setModalText("Por favor, llenar todos los espacios obligatorios (*)");
            return null;
        } if (email !== emailc) {
            setShowModal(true);
            setModalTitle("¡Error!");
            setModalText("El correo ingresado y el correo de confirmación no coinciden.");
            return null;
        } if (passwd !== passwdc) {
            setShowModal(true);
            setModalTitle("¡Error!");
            setModalText("Las contraseñas no coinciden.");
            return null;
        } else {
            fetch(global.UBYMED_WS_BASE + 'api/usuario', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: "crearUsuario",
                    nombres: nombre,
                    apellidos: apellido,
                    sexo: (sexo === 'F' ? 2 : 1),
                    fecha_nacimiento: fechaNac,
                    telefonos: telefono,
                    email: email,
                    passwd: passwd,
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
                    setRegistroExitoso(1);
                    setShowModal(true);
                    setModalTitle('¡Registro correcto!');
                    setModalText('Por favor, valida tu correo electrónico a través del enlace que enviamos a tu correo y luego ya puedes ingresar con tu correo electrónico y tu contraseña.');
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

    useEffect(() => {
    });


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
                        navigation.navigate('Login');
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



        <ScrollView>
            <View style={styles.containerServicios}>
                <View style={styles.containerServiciosHeader}>
                    <Image source={require('../assets/header_registro.png')} style={styles.serviciosHeaderImg} resizeMode="stretch" />
                </View>

                <Text style={styles.TituloSeccion}>Nuevo Usuario</Text>

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
                            />
                        </View>
                    </View>

                    <View style={styles.formularioInputContainerLineSup}>
                        <View style={styles.FormularioRow}>
                            <Text style={styles.FormTextLabel}>DPI</Text>
                            <TextInput 
                                style={styles.FormTextInput}
                                placeholder="DPI"
                                placeholderTextColor="#BDBDBD"
                                onChangeText={(DPI) => setDPI(DPI)}

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
                            />
                        </View>
                    </View>
                    <View style={styles.formularioInputContainerLineSup}>
                        <View style={styles.FormularioRow}>
                            <Text style={styles.FormTextLabel}>Email</Text>
                            <TextInput
                                style={styles.FormTextInput}
                                placeholder="yo@email.com"
                                placeholderTextColor="#BDBDBD"
                                onChangeText={(email) => setEmail(email)}
                            />
                        </View>
                    </View>
                    <View style={styles.formularioInputContainerLineSup}>
                        <View style={styles.FormularioRow}>
                            <Text style={styles.FormTextLabel}>Confirmar email</Text>
                            <TextInput
                                style={styles.FormTextInput}
                                placeholder="yo@email.com"
                                placeholderTextColor="#BDBDBD"
                                onChangeText={(email) => setEmailc(email)}
                            />
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


                <View style={styles.formularioContainer}>
                    <View style={styles.FormularioRow}>
                        <View style={styles.StyleCheckTPView}>
                            <UCheckbox
                                style={styles.StyleCheckTP} 
                                value={aceptartp}
                                onChange={(newValue) => { setAceptartp(newValue) }}
                            />
                        </View>
                        <View style={styles.StyleTextTPView}>
                            <Text style={styles.StyleTextTP} >
                                <Text>He leído y acepto los</Text>
                                <Text style={{color: 'blue' }}   
                                        onPress={() => {
                                            Linking.canOpenURL('https://ubymed.com/terminos-y-condiciones/')
                                            .then(supported => {
                                                if (!supported) {
                                                    Alert.alert('No hemos encontrado un aplicación para abrir el link.');
                                                } else {
                                                    return Linking.openURL('https://ubymed.com/terminos-y-condiciones/');
                                                }
                                            })
                                            .catch(err => console.error('An error occurred', err));
                                    }}
                                > terminos y condiciones </Text>
                                <Text>y las </Text>
                                <Text style={{color: 'blue' }}  
                                    onPress={() => {
                                        Linking.canOpenURL('https://ubymed.com/politica-de-privacidad/')
                                        .then(supported => {
                                            if (!supported) {
                                                Alert.alert('No hemos encontrado un aplicación para abrir el link.');
                                            } else {
                                                return Linking.openURL('https://ubymed.com/politica-de-privacidad/');
                                            }
                                        })
                                        .catch(err => console.error('An error occurred', err));
                                    }}
                                > políticas de privacidad. </Text>
                            </Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.registroBtn} onPress={registrar} >
                    <Text style={styles.registroBtnText} >Registrar</Text>
                </TouchableOpacity>
                
            </View>
        </ScrollView>

        </React.Fragment>


</TouchableWithoutFeedback>
    </KeyboardAvoidingView>


    );
}
