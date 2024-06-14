import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import style from './style';


const Approval = () => {
    const [loading, setLoading] = useState(true);
    const [pendingApprove, setPendingApprove] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await getToken();
            fetchPendingApprove();
        };
        fetchData();
    }, []);

    const getToken = async () => {
        try {
            const response = await axios.post(
                'http://192.168.1.112:8000/o/token/',
                {
                client_id: 'v54moZleL2wN59RzzwZr3yGPaFwqy5g41JPX0ztx',
                client_secret: 'WeT6yjxvTmX9fsyeNbhEgQPxRzGucgDtF6S3odlvu0fgENCdI7gyilylMqX1pDVgFRXyyBiSTwbqEG07V8j0xOmBzP4y3X3iuB4zg9u19xMVMnFsR5Um7BqH0yAUVN4f',
                grant_type: 'password',
                username: 'admin',
                password: 'admin'  
                }
            );
            console.log("API RESPONSE:", response.data)
            const accessToken = response.data.access_token;
            await AsyncStorage.setItem('access_token', accessToken);
        } catch (error) {
            console.error('Error getting access token:', error);
            Alert.alert('Error', 'Failed to authenticate admin');
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingApprove = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('access_token');
            const response = await axios.get(
                'http://192.168.1.112:8000/approve/pending/',
                {
                    headers: {
                        Authorization: `Bearer ${storedToken}`
                    }
                }
            );
            setPendingApprove(response.data);
        } catch (error) {
            console.error('Error getting pending approve:', error);
            Alert.alert('Error', 'Failed to fetch pending approve');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id, code, first_name) => {
        try {
            const storedToken = await AsyncStorage.getItem('access_token');
            console.log('Stored Token:', storedToken);

            if (!storedToken) {
                console.error('No stored token found');
                Alert.alert('Error', 'No access token found');
                return;
            }

            console.log('Payload:', {
                code: code,
                password: first_name,
                id: id
            });

            const response = await axios.post(
                `http://192.168.1.112:8000/approve/${id}/confirm/`,
                {
                    code: code,
                    password: first_name
                },
                {
                    headers: {
                        Authorization: `Bearer ${storedToken}`
                    }
                }
            );
            console.log('Approval response:', response.data);
            Alert.alert('Success', 'Yêu cầu đã được duyệt');
            fetchPendingApprove();
        } catch (error) {
            console.error('Error approving request:', error);
            if (error.response) {
                console.log('Error response headers:', error.response.headers);
            }
            Alert.alert('Error', 'Failed to approve request');
        }
    };

    const renderRequestItem = ({ item }) => {
        return (
            <View style={style.itemContainer}>
                <Text style={style.name}>{`${item.student.last_name} ${item.student.first_name}`}</Text>
                <Text style={style.code}>{`MSSV: ${item.student.code}`}</Text>
                <TouchableOpacity onPress={() => handleApprove(item.id, item.student.code, item.student.first_name)} style={style.button}>
                    <Text style={style.buttonText}>Approve</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={style.container}>
            <View style={style.headerContainer}>
                <Text style={style.header}>Danh sách phiếu yêu cầu</Text>
            </View> 
            <FlatList
                data={pendingApprove}
                renderItem={renderRequestItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
   
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    
});

export default Approval;
