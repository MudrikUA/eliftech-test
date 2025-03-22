export const getApiUrl = () => {
    if (window.env && window.env.REACT_APP_API_URL) {
        return window.env.REACT_APP_API_URL;
    }
    throw new Error("API URL not loaded. Ensure /env.js is fetched before using getApiUrl()");
};