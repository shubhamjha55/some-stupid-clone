export interface RequestOptions {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    url: string;
    body?: any;
    headers?: { [key: string]: string };
}

interface ApiResponse<T> {
    data: T;
    error: string | null;
}

// Generic request handler function
const RequestHandler = async <T>(options: RequestOptions): Promise<ApiResponse<T>> => {
    const { method, url, body, headers } = options;

    try {
        const response = await fetch("http://localhost:8080/" + url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                //'Authorization': `Bearer ${window["accessToken"]}`,
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const errorText = await response.json();
            return { data: null as any, error: errorText.message };
        }

        const data: T = await response.json();

        return { data, error: null };
    } catch (error: any) {
        // Return the error message in case of failure
        return { data: null as any, error: error.message };
    }
};

export default RequestHandler;
