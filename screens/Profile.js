import React from 'react';
import { StyleSheet, View, Image, Text, Linking, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Title, Card, Button } from 'react-native-paper';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

const Profile = (props) => {

    const { _id,  name, position, email, phone, salary, picture } = props.route.params.item
    
    const openDail = (phone) => {
        if (Platform.OS === 'android')
            Linking.openURL(`tel:${phone}`);
        else if (Platform.OS === 'ios')
            Linking.openURL(`telprompt:${phone}`);
    }

    const dispatch = useDispatch();

    const deleteEmploye = () => {
        fetch("https://2cd99ec7.ngrok.io/delete", {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: _id })
        })
        .then(res => res.json())
        .then(deletedEmp=>{
            Alert.alert(`${deletedEmp.name} deleted`);
            props.navigation.navigate("Home");
            dispatch({ type: 'DELETE_DATA', payload: _id });
        })
        .catch(err=>{
            Alert.alert("someting went wrong");
        });
    }

    return (
        <View style={styles.root}>
            <LinearGradient
                colors={['#0033ff', '#6bc1ff']}
                style={{height: '20%'}}
            />
            <View style={{alignItems: 'center'}}>
                <Image
                    style={{width:140, height:140, borderRadius:70, marginTop: -50}}
                    source={{uri: `https://2cd99ec7.ngrok.io${picture}` }}
                />
            </View>
            <View style={{alignItems: 'center', margin: 15}}>
                <Title>{name}</Title>
                <Text style={{fontSize: 18}}>{position}</Text>
            </View>
            <Card style={styles.myCard} onPress={() => Linking.openURL(`mailto:${email}`)}>
                <View style={styles.cardContenet}>
                    <MaterialIcons name='email' size={32} color='#006aff' />
                    <Text style={styles.myText}>{email}</Text>
                </View>
            </Card>
            <Card style={styles.myCard} onPress={() => openDail(phone)}>
                <View style={styles.cardContenet}>
                    <Entypo name='phone' size={32} color='#006aff' />
                    <Text style={styles.myText}>{phone}</Text>
                </View>
            </Card>
            <Card style={styles.myCard}>
                <View style={styles.cardContenet}>
                    <MaterialIcons name='attach-money' size={32} color='#006aff' />
                    <Text style={styles.myText}>{salary}</Text>
                </View>
            </Card>
            <View style={{flexDirection: 'row', justifyContent: 'space-around', padding: 10}}>
                <Button
                    icon='account-edit'
                    mode='contained'
                    theme={theme}
                    onPress={() => {
                        props.navigation.navigate('Create Employee', { _id, name, phone, salary, email, position, picture })
                    }}
                >
                    Edit
                </Button>
                <Button
                    icon='delete'
                    mode='contained'
                    theme={theme}
                    onPress={() =>deleteEmploye()}
                >
                    Fire Employee
                </Button>
            </View>
        </View>
    )
}

const theme = {
    colors: {
        primary: '#006aff'
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    myCard: {
        margin: 3,
    },
    cardContenet: {
        flexDirection:'row',
        padding: 8
    },
    myText: {
        fontSize: 18,
        marginTop: 3,
        marginLeft: 5
    }
});

export default Profile;