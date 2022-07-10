import React, { useState } from "react";
import { Alert, Modal, Text, Pressable, View, TextInput, Image, TouchableOpacity } from "react-native";
import styles from "../styles";
import * as varG from "../components/varG";

import AsyncStorage from '@react-native-async-storage/async-storage';
const LoginPilar = ({navigation, route}) => {
  var tokenUbymed;
  const [modalVisible, setModalVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalText, setModalText] = useState('');
  const [Usuario,  setUsuario] = useState('');
  const [Password, setPassword] = useState('');

//servicio de autenticación al API, apuntar al ambiente adecuado...
const UserLoginFunction = () => {
    //request tipo POST hacia el API RestFul, request y response en formato JSON
    
    fetch('http://apix.elpilar.gt:9000/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            usuario: Usuario,
            password: Password
        })
    }).then((response) => response.json())
    .then((responseJson) => {
        if(responseJson["token"]) {
            tokenUbymed = responseJson["token"]
            validarToken()          
        } else {
            setModalVisible(true)
        }
    }).catch((error) => {
        //escribir los errores serveros en la consola e informar al usuario
        console.error(error);
        setShowModal(true);
        setModalTitle("¡Error!");
        setModalText("Hubo un error crítico, por favor, intentelo de nuevo más tarde.");
    });
  }
const validarToken = () => {
    var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer "+tokenUbymed);
var raw = "";
var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://apix.elpilar.gt:9000/socio/S-00027/status", requestOptions)
  .then(responseJson => responseJson.json())
  .then(result => {
    if(result["estado"] === "A") {
        varG.estado = "true";
        varG.DPI = result["dpi"];
        navigation.goBack();
    }else if (result["estado"] === "B"){
        setShowModal(true);
        setModalTitle("¡Error!");
        setModalText("Este usuario fue temporalmente desactivado o dado de baja");

    }else if (result["estado"] === "I"){
        setShowModal(true);
        setModalTitle("¡Error!");
        setModalText("Usuario inactivo");

    }else {
        Alert.alert("Error!!")
    } 
})
  .catch(error => console.log('error', error));
}
  return (
    
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
                onPress={() => setShowModal(!showModal)}
            >
                <Text style={styles.textStyle}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


    <View style={styles.centeredView}>
        <View style={styles.logoLogin}>
            <Image source={require('../assets/LOGINPILAR.png')} style={styles.logoLoginPilar} resizeMode="contain" />
        </View>
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);}}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                <Text style={styles.modalText}>Datos incorrectos</Text>
                <Pressable
                 style={[styles.button, styles.buttonClose]}
                 onPress={() => setModalVisible(!modalVisible)}
                >
                <Text style={styles.textStyle}>Cerrar</Text>
                </Pressable>
                </View>
            </View>
        </Modal>

        <View style={styles.CardBox}>
            <View style={styles.formularioInputContainer}>
                <TextInput
                    style={styles.formularioTextInput}
                     placeholder="Usuario"
                     autoCapitalize='none'
                     placeholderTextColor="#BDBDBD"
                     onChangeText={(Usuario) => setUsuario(Usuario)}

                    />
            </View>
            <View style={styles.formularioInputContainerLineSup}>
                <TextInput
                    style={styles.formularioTextInput}
                    placeholder="Contraseña"
                    placeholderTextColor="#BDBDBD"
                    secureTextEntry={true}
                    onChangeText={(Password) => setPassword(Password)}

                />
            </View>
        </View>
        <Pressable style={[styles.buttonReviewEnviar]} onPress={UserLoginFunction}>
            <Text style={styles.registroBtnText}>Registrar  </Text>
        </Pressable>
         <View style={styles.logoLogin}>
                <Image source={require('../assets/LOGINPILAR2.png')} style={styles.logoLoginPilar} resizeMode="contain" />
        </View>
    </View>
    </React.Fragment>
  );
};
export default LoginPilar;