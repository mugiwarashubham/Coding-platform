const axios = require('axios');

const JUDGE0_URL = 'https://ce.judge0.com';

const getLanguageById = (lang) => {
    const language = {
        "c++": 54,
        "java": 62,
        "javascript": 63,
        "python": 71
    };
    return language[lang.toLowerCase()];
};

const submitBatch = async (submissions) => {
    const response = await axios.post(
        `${JUDGE0_URL}/submissions/batch?base64_encoded=false`,
        { submissions },
        { headers: { 'Content-Type': 'application/json' } }
    );

    console.log("submitBatch raw response:", JSON.stringify(response.data)); // DEBUG

    // ce.judge0.com returns array directly, NOT { submissions: [...] }
    const data = response.data;
    if (Array.isArray(data)) return data;               // [ {token}, {token} ]
    if (Array.isArray(data.submissions)) return data.submissions; // fallback
    throw new Error("Unexpected batch response: " + JSON.stringify(data));
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const submitToken = async (tokens) => {
    const tokenStr = tokens.join(',');

    while (true) {
        const response = await axios.get(`${JUDGE0_URL}/submissions/batch`, {
            params: {
                tokens: tokenStr,
                base64_encoded: 'false',
                fields: 'token,stdout,stderr,status_id,status,compile_output'
            }
        });

        console.log("submitToken raw response:", JSON.stringify(response.data)); // DEBUG

        // Same fix — handle both formats
        const results = Array.isArray(response.data)
            ? response.data
            : response.data.submissions;

        if (!results) throw new Error("Unexpected token response: " + JSON.stringify(response.data));

        const allDone = results.every((r) => r.status_id > 2);
        if (allDone) return results;

        await sleep(1000);
    }
};

module.exports = { getLanguageById, submitBatch, submitToken };