import React, { useState } from 'react';
import { StyleSheet, View, Modal, Alert, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { useDispatch } from 'react-redux';

const CreateEmployee = ({ navigation, route }) => {
    const getDetails = (type) => {
        if (route.params) {
            switch(type) {
                case "name":
                    return route.params.name;
                case "phone":
                   return route.params.phone;
                case "email":
                  return route.params.email;
                case "salary":
                    return route.params.salary;
                case "picture":
                    return  route.params.picture;
                case "position":
                  return  route.params.position;
            }
        }
        return '';
    }

    const [name, setName] = useState(getDetails('name'));
    const [phone, setPhone] = useState(getDetails('phone'));
    const [email, setEmail] = useState(getDetails('email'));
    const [salary, setSalary] = useState(getDetails('salary'));
    const [picture, setPicture] = useState(getDetails('picture'));
    const [position, setPosition] = useState(getDetails('position'));
    const [modal, setModal] = useState(false);
    const [enableshift,setenableShift] = useState(false);

    const dispatch = useDispatch();

    const submitData = () => {
        fetch('http://localhost:3000/send-data', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                email,
                phone,
                salary,
                picture,
                position
            })
        })
        .then(res => res.json())
        .then(data => {
            Alert.alert(`${data.name} is saved successfuly`);
            navigation.navigate("Home");
            dispatch({ type: 'ADD_DATA', payload: data });
        })
        .catch(err => {
          Alert.alert("someting went wrong");
        });
    }

    const updateDetails = () => {
        fetch("http://localhost:3000/update",{
            method:"post",
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify({
                id: route.params._id,
                name,
                email,
                phone,
                salary,
                picture,
                position
            })
        })
        .then(res => res.json())
        .then(data => {
            Alert.alert(`${data.name} is updated successfuly`);
            dispatch({ type: 'UPDATE_DATA', payload: { _id: route.params._id, name, email, phone, salary, picture, position } });
            navigation.navigate("Home");
        })
        .catch(err => {
          Alert.alert("someting went wrong");
      });
    }

    const pickFromGallery = async () => {
        const { granted } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (granted) {
            var data = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
            if (!data.cancelled) {
                // let newfile = { uri: data.uri, type: `test/${data.uri.split('.')[1]}`, name: `test.${data.uri.split('.')[1]}` };
                let newfile = { uri: data.uri, type: `image/jpeg`, name: `image.jpeg` };
                handleUpload(newfile);
            }
        }
        else
            Alert.alert('You need to give up permission to access Gallery!')
    }

    const pickFromCamera = async () => {
        const { granted } = await Permissions.askAsync(Permissions.CAMERA);
        if (granted) {
            var data = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
            if (!data.cancelled) {
                // let newfile = { uri: data.uri, type: `test/${data.uri.split('.')[1]}`, name: `test.${data.uri.split('.')[1]}` };
                let newfile = { uri: data.uri, type: `image/jpeg`, name: `image.jpeg` };
                handleUpload(newfile);
            }
        }
        else
            Alert.alert('You need to give up permission to access Camera!')
    }

    const handleUpload = (image) => {
        const formData = new FormData();
        formData.append('image', image);

        fetch('http://localhost:3000/upload', {
            method: 'post',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            setPicture(data.url);
            setModal(false);
        })
        .catch(err => {
            Alert.alert('Error while uploading');
            setModal(false);
        });
    }

    return (
        <KeyboardAvoidingView behavior='position' style={styles.root} enabled={enableshift}>
            <View>
                <TextInput
                    label='Name'
                    style={styles.inputStyle}
                    value={name}
                    onFocus={()=>setenableShift(false)}
                    theme={theme}
                    mode='outlined'
                    onChangeText={text => setName(text)}
                />
                <TextInput
                    label='Email'
                    style={styles.inputStyle}
                    value={email}
                    theme={theme}
                    onFocus={()=>setenableShift(false)}
                    mode='outlined'
                    onChangeText={text => setEmail(text)}
                />
                <TextInput
                    label='phone'
                    style={styles.inputStyle}
                    value={phone}
                    theme={theme}
                    onFocus={()=>setenableShift(false)}
                    keyboardType='number-pad'
                    mode='outlined'
                    onChangeText={text =>setPhone(text)}
                />
                <TextInput
                    label='salary'
                    style={styles.inputStyle}
                    value={salary}
                    theme={theme}
                    onFocus={()=>setenableShift(true)}
                    mode='outlined'
                    onChangeText={text =>setSalary(text)}
                />
                <TextInput
                    label='position'
                    style={styles.inputStyle}
                    value={position}
                    theme={theme}
                    onFocus={()=>setenableShift(true)}
                    mode='outlined'
                    onChangeText={text =>setPosition(text)}
                />
                <Button
                    icon={picture === '' ? 'upload' : 'check'}
                    style={styles.inputStyle}
                    mode='contained'
                    onPress={() => setModal(true)}
                >
                    Upload Image
                </Button>
                {
                    route.params ?
                    <Button
                    style={styles.inputStyle}
                    icon="content-save"
                     mode="contained" 
                     theme={theme}
                     onPress={() => updateDetails()}>
                          Update details
                    </Button>
                    :
                    <Button
                        icon='content-save'
                        style={styles.inputStyle}
                        mode='contained'
                        onPress={() => submitData()}
                    >
                        Save
                    </Button>
                }
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={modal}
                    onRequestClose={() => setModal(false)}
                >
                    <View style={styles.modalView}>
                        <View style={styles.modalButtonView}>
                            <Button
                                icon='camera'
                                theme={theme}
                                mode='contained'
                                onPress={() => pickFromCamera()}
                            >
                                Camera
                            </Button>
                            <Button
                                icon='image-area'
                                theme={theme}
                                mode='contained'
                                onPress={() =>pickFromGallery()}
                            >
                                Gallery
                            </Button>
                        </View>
                        <Button
                            onPress={() => setModal(false)}
                        >
                            Cancel
                        </Button>
                    </View>
                </Modal>
            </View>
        </KeyboardAvoidingView>

    )
}

const theme = {
    colors: {
        primary: '#006aff'
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    inputStyle: {
        margin: 5
    },
    modalView: {
        position: 'absolute',
        bottom: 2,
        width: '100%',
        backgroundColor: 'white'
    },
    modalButtonView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
});

export default CreateEmployee;