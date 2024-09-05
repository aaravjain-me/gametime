import backendEndpoint from "./useBackendEndpoint";

const filterUsername = async (username) => {
    try {
        const data = await backendEndpoint("http://localhost:5000/gets/username", {}, 'get');
        
        // Ensure 'usernames' exists and is an array
        const usernames = data?.usernames || [];

        if (usernames.includes(username)) {
            return "Username not available";
        } else {
            return "Proceed, username is available";
        }
    } catch (error) {
        console.error("Error fetching usernames:", error);
        return "Error occurred while checking username availability";
    }
}

export default filterUsername;
