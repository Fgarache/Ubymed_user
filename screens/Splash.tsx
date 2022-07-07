
import * as React from 'react';

import {Component, useState, useEffect} from 'react';
import { View, Image } from 'react-native';

import styles from "../styles";


import { AuthContext } from '../components/context.js';

export default Splash = ({ navigation, route }) => {

    const loginContext = React.useContext(AuthContext);
    setTimeout(function(){ navigation.navigate("Home", { }); }, 1000);

    return (
    <View style={styles.containerSplash}>
        <View style={styles.logoSplash}>
            <Image source={require('../assets/logo_splash.png')} style={styles.logoSplash} resizeMode="contain" />
        </View> 
    </View>
    );
}
