const UMAMI_URL = 'https://umami.example.com'
function fetchActiveUserCount() {
    fetch(`${UMAMI_URL}/api/active-users`).then((response) => {
        console.log(response)
    }).catch((error) => {
        console.error(error)
    })
}

export { fetchActiveUserCount }