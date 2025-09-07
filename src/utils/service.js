
const base_url = 'http://127.0.0.1:3000/api';

const getVideoMeta = async (input) => {
    const req_url = `${base_url}/video.meta`;
    const headers = { 'content-type': 'application/json' };
    const response = await fetch(req_url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ input })
    });
    const result = await response.json();
    return result;
};

const getAllVideos = async (input) => {
    const req_url = `${base_url}/video.all`;
    const headers = { 'content-type': 'application/json' };
    const response = await fetch(req_url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ input })
    });
    const result = await response.json();
    return result;
};


const concatVideos = async (input) => {
    const req_url = `${base_url}/video.concat`;
    const headers = { 'content-type': 'application/json' };
    const response = await fetch(req_url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(input)
    });
    const result = await response.json();
    return result;
};

const extraAudio = async (input) => {
    const req_url = `${base_url}/audio.extra`;
    const headers = { 'content-type': 'application/json' };
    const response = await fetch(req_url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(input)
    });
    const result = await response.json();
    return result;
};

const getThumbnail = async (input) => {
    const req_url = `${base_url}/video.thumbnail`;
    const headers = { 'content-type': 'application/json' };
    const response = await fetch(req_url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ input })
    });
    const result = await response.text();
    return result;
};

const playVideo = async (input) => {
    const req_url = `${base_url}/video.play`;
    const headers = { 'content-type': 'application/json' };
    const response = await fetch(req_url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ input })
    });
    const result = await response.json();
    return result;
};




export default {
    getVideoMeta,
    getAllVideos,
    concatVideos,
    extraAudio,
    getThumbnail,
    playVideo

};