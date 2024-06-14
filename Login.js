import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { TextInput, IconButton } from 'react-native-paper';
import style from './style';
import MyStyle from '../../styles/MyStyle';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');

    const login = async () => {
        try {
            const response = await axios.post('http://192.168.1.112:8000/accounts/', {
                username: username,
                password: password,
                code: code,
            });
            const token = response.data.token;
            // Lưu token và xử lý tiếp theo
        } catch (error) {
            Alert.alert('Error', 'Invalid credentials or account not approved');
        }
    };

    return (
        <View style={[style.containerLogin]}>
            <View style={style.headerContainer}>
                <Text style={style.header}>ĐĂNG NHẬP</Text>
            </View>
            
            <View style={style.inputContainer}>
                <TextInput
                    value={code}
                    onChangeText={text => setCode(text)}
                    placeholder="Code"
                    style={style.inputLogin}
                />
                <IconButton icon="account" size={20} style={style.icon} />
            </View>
            
            <View style={style.inputContainer}>
                <TextInput
                    value={username}
                    onChangeText={text => setUsername(text)}
                    placeholder="Username"
                    style={style.inputLogin}
                />
                <IconButton icon="account" size={20} style={style.icon} />
            </View>
            
            <View style={style.inputContainer}>
                <TextInput
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                    placeholder="Password"
                    style={style.inputLogin}
                />
                <IconButton icon="eye" size={20} style={style.icon} />
            </View>

            <TouchableOpacity onPress={login} style={style.button}>
                <Text style={style.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Login;
