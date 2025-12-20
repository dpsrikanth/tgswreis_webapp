
const default_headers = (token) => {
    const headers = {
        "Content-Type": "application/json"
    };
    if (token) {
        headers["Authorization"] = `token=${token}`;
    }
    return headers;
};
const file_upload_headers = (token) => {
    const headers = {
        // "Content-Type": "multipart/form-data"
    };
    if (token) {
        headers["Authorization"] = `token=${token}`;
    }
    return headers;
};

export const _fetch = async (url, payload = null, hasfile = false, token = null, urlsearch = '', urlreplace = '') => {
    try {
        const headers = hasfile ? file_upload_headers(token) : default_headers(token);
        const _url = window.gc.urls[url];
        let url2 = _url.url;
        if (urlsearch && urlreplace) {
            if (!_url) {
                throw new Error(`URL for ${url} not found in gc.urls`);
            }
            // _url = {
            //     ..._url, url: _url.url.replace(urlsearch, urlreplace)
            // };

             url2 = url2.replace(urlsearch, urlreplace)
        }
        const cookies = sessionStorage.getItem("cookies");
        if (cookies) {
            headers["Cookie"] = cookies;
        }
        const options = {
            method: _url.method,
            headers: headers,
            credentials: 'include', // Include cookies in the request
            redirect: 'follow', // Follow redirects
            body: _url.method === 'GET' ? undefined : (hasfile ? payload : JSON.stringify(payload))
        };
        if (options.method === 'GET' && payload) {
            const queryParams = new URLSearchParams(payload).toString();
             url2 += `?${queryParams}`; // Append query parameters for GET requests
        }
        if (payload === null || _url.method === 'GET') {
            delete options.body; // Ensure body is null for GET requests
        }
        const response = await fetch(url2, options);
        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }
            //throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};


export const getInitials = (fName = '', lName = '') =>
  `${fName[0] || ''}${lName[0] || ''}`.toUpperCase();

