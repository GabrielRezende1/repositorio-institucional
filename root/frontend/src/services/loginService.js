import axios from "axios";

export async function login(email, password) {
    try {
        const res = await axios.post('http://localhost:3000/api/login', {
            email: email,
            senha: password
        }, { withCredentials: true });
        return { success: true, data: res.data };
    } catch (err) {
        return { success: false, error: err.response.data };
    }
}

export async function checkLogin() {
    try {
        const res = await axios.get('http://localhost:3000/api/login', { withCredentials: true });
        console.log(res.data);
        return { success: true, data: res.data.token };
    } catch (err) {
        console.log(err.response.data);
        return { success: false, error: err.response.data };
    }
}

export async function logout() {
    try {
        const res = await axios.delete('http://localhost:3000/api/logout', { withCredentials: true });
        return { success: true, data: res.data };
    } catch (err) {
        return { success: false, error: err.response.data };
    }
}