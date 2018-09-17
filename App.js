import React, { Component } from 'react';
import {
  Alert,
  Linking,
  Dimensions,
  LayoutAnimation,
  Text,
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import {
  createStackNavigator,
  TabNavigator,
  TabBarBottom,
} from 'react-navigation';
import * as firebase from 'firebase';

var config = {
  apiKey: 'AIzaSyBaDFN9ive_WcDv22fZi8ZS_XFxhVTigyI',
  authDomain: 'icare-a350b.firebaseapp.com',
  databaseURL: 'https://icare-a350b.firebaseio.com',
  projectId: 'icare-a350b',
  storageBucket: 'icare-a350b.appspot.com',
  messagingSenderId: '696032112369',
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

var database = firebase.database();

class HomeScreen extends Component {

  static navigationOptions = {
    header: null,
  };

  state = {
    hasCameraPermission: null,
    lastScannedUrl: null,
  };

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _handleBarCodeRead = result => {
    const { navigate } = this.props.navigation;
    var lectura = JSON.parse(result.data);
    firebase
      .database()
      .ref('/json')
      .once('value')
      .then(function(snapshot) {
        var snap = snapshot.val();
        if (lectura.id === snap.id) {
          console.log(snap);
          navigate('Usuario', { datos: snap });
        }
      });
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>

        {this.state.hasCameraPermission === null
          ? <Text>Requesting for camera permission</Text>
          : this.state.hasCameraPermission === false
              ? <Text style={{ color: '#fff' }}>
                  Camera permission is not granted
                </Text>
              : <BarCodeScanner
                  onBarCodeRead={this._handleBarCodeRead}
                  style={{
                    height: Dimensions.get('window').height,
                    width: Dimensions.get('window').width,
                  }}
                />}

        {}

        <StatusBar hidden />
      </View>
    );
  }
}

class UsuarioScreen extends Component {
  render() {
    const { navigation } = this.props;
    const datos = navigation.getParam('datos', '{"id": 0}');

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text>Details Screen</Text>
        <Text>Id: {JSON.stringify(datos.id)}</Text>
        <Text>Nombre: {JSON.stringify(datos.nombre)}</Text>
      </View>
    );
  }
}

const Pantallas = createStackNavigator(
  {
    Home: HomeScreen,
    Usuario: UsuarioScreen,
  },
  {
    initialRouteName: 'Home',
  }
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    flexDirection: 'row',
  },
  url: {
    flex: 1,
  },
  urlText: {
    color: '#fff',
    fontSize: 20,
  },
  cancelButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
  },
});
export default Pantallas;
