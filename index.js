
async function getServerTime() {
    try {
        const response = await fetch('/server-time');
        if (!response.ok) {
            throw new Error();
        }
        console.log("hello world")
        const data = await response.json;
        console.log(new Date(data.serverTime));

    } catch (error) {
        console.error('Error fetching server time:', error);
    }

}
getServerTime();