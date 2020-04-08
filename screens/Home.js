import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Card, FAB } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';

const Home = ({ navigation }) => {
    // const [data, setData] = useState([]);
    // const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const { data, loading } = useSelector((state) => {
        return state;
    });

    useEffect(() => {
        fetch('http://localhost:3000/', {
            method: 'get'
        })
        .then(res => res.json())
        .then(data => {
            // setData(data);
            // setLoading(false);
            dispatch({ type: 'GET_DATA', payload: data });
            dispatch({ type: 'SET_LOADING', payload: false });
        })
        .catch(err => {
            Alert.alert("someting went wrong");
        });
    }, []);

    const fetchData = () => {
        fetch('http://localhost:3000/', {
            method: 'get'
        })
        .then(res => res.json())
        .then(data => {
            // setData(data);
            // setLoading(false);
            dispatch({ type: 'GET_DATA', payload: data });
            dispatch({ type: 'SET_LOADING', payload: false });
        })
        .catch(err => {
            Alert.alert("someting went wrong");
        });
    }

    const renderList = ((item, index) => {
        return (
            <Card style={styles.mycard} onPress={() => navigation.navigate('Profile', { item })} key={index}>
            <View style={styles.cardView} key={index}>
                <Image style={{width:60, height:60, borderRadius:30}} source={{uri: `http://localhost:3000${item.picture}` }} />
                <View style={{marginLeft: 10}}>
                    <Text style={styles.text}>{item.name}</Text>
                    <Text>{item.position}</Text>
                </View>
            </View>
        </Card>
        )
    });

    return (
        <View style={{flex: 1}}>
            {
                loading ?
                <ActivityIndicator size='large' colors='#0000ff' /> :
                <FlatList
                    data={data}
                    renderItem={({item, index}) => {
                        return renderList(item, index)
                    }}
                    keyExtractor={(item, index) => String(index)}
                    onRefresh={() => fetchData()}
                    refreshing={loading}
                />
            }
            <FAB
                style={styles.fab}
                small={false}
                icon='plus'
                theme={{colors:{accent:'#006aff'}}}
                onPress={() => navigation.navigate('Create Employee')}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    mycard: {
        margin: 5,
    },
    cardView: {
        flexDirection: "row",
        padding: 6
    },
    text: {
        fontSize: 18,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
})

export default Home;