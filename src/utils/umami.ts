import { UMAMI } from "../config";

const baseURL = UMAMI.baseURL;
const username = UMAMI.username;
const password = UMAMI.password;
const websiteID = UMAMI.websiteID;

let currentToken: string | null = null;


async function login() {
    console.log("Logging in...");
    const response = await fetch(`${baseURL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
    const {token} = await response.json();
    currentToken = token;
}

async function verifyToken() {
    console.log("Verifying token...");
    const response = await fetch(`${baseURL}/api/auth/verify`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${currentToken}`,
        },
    });
    return response.ok;
}
async function refreshToken () {
    try{
        if (currentToken === null) {
            await login();
            return;
        }
        const isTokenValid = await verifyToken();
        if (!isTokenValid) {
            await login();
        }
        setTimeout(refreshToken, 30 * 60 * 1000);
    }catch(e){
        console.error("umami token refresh failed: ",e);
    }
}
async function get3minActiveUsers() {
    try{
        if (currentToken === null) {
            await refreshToken();
        }
        const response = await fetch(`${baseURL}/api/websites/${websiteID}/active`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${currentToken}`,
            },
        });
        const data = await response.json();
        const x = data[0].x;
        return x;   
    }catch(e){
        console.error("获取活动用户失败 ",e);
        return 0;
    }
}

export { get3minActiveUsers }