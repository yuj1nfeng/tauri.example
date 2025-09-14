const base_url = 'http://localhost:3000';


export default async (api, input) => {
    const req_url = `${base_url}/${api}`;
    const headers = { 'content-type': 'application/json' };
    const response = await fetch(req_url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(input),
    });
    const result = await response.json();
    return result;
};