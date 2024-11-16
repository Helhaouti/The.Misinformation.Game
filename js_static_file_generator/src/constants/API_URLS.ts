/**
 * Provides methods to interact with the database's API.
 */
const BASE_URL = `${window.location.origin}/api`;


/**
 * API_URLS object contains various API URLs for different operations related to studies.
 *
 * @property {string} QUERY_STUDY_URL - URL for querying a specific study.
 * @property {string} QUERY_ALL_STUDIES_URL - URL for querying all studies.
 * @property {string} INSERT_STUDY_URL - URL for inserting a new study.
 * @property {string} UPLOAD_IMAGE_URL - URL for uploading study image as base64.
 */
export const API_URLS = {
    INSERT_STUDY_URL: `${BASE_URL}/dash/studies`,
    GET_RESULTS_URL: `${BASE_URL}/dash/studies/results`,
    QUERY_ALL_STUDIES_URL: `${BASE_URL}/dash/studies`,
    QUERY_STUDY_URL: `${BASE_URL}/dash/studies/`,
    UPLOAD_IMAGE_URL: `${BASE_URL}/dash/studies/images`,
    UPDATE_STUDY_ENABLED_URL: `${BASE_URL}/dash/studies/enable`,
    REMOVE_STUDY_URL: `${BASE_URL}/dash/studies`,
};