import { ValidationReport } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const apiService = {
    /**
     * Uploads a PDF DPR file and initiates async processing.
     * @param file The PDF file to upload
     * @returns Object containing the Job ID
     */
    async uploadDPR(file: File): Promise<{ jobId: string }> {
        const formData = new FormData();
        formData.append('file', file);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for upload

        try {
            const response = await fetch(`${API_BASE_URL}/dpr/upload`, {
                method: 'POST',
                body: formData,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to upload DPR');
            }

            return response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Upload timeout - backend server may not be responding');
            }
            throw error;
        }
    },

    /**
     * Polls the status of a processing job.
     * @param jobId The Job ID returned from upload
     * @returns Status object with result if completed
     */
    async pollStatus(jobId: string): Promise<{ status: string; lifecycleStatus: string; result?: any; error?: string }> {
        const response = await fetch(`${API_BASE_URL}/dpr/status/${jobId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch job status');
        }

        return response.json();
    },

    /**
     * Fetches all uploaded DPRs from the backend.
     * @returns Array of DPR objects with metadata and analysis results
     */
    async getAllDPRs(): Promise<any[]> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
            console.log(`API_BASE_URL: ${API_BASE_URL}`);
            const response = await fetch(`${API_BASE_URL}/dpr/list`, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`HTTP ${response.status}: ${errorText}`);
                throw new Error(`Failed to fetch DPR list: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('API response data:', data);
            return data;
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('getAllDPRs error:', error);
            
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - backend server may not be responding');
            }
            
            throw error;
        }
    },

    /**
     * Deletes a DPR by Job ID.
     * @param jobId The Job ID of the DPR to delete
     */
    async deleteDPR(jobId: string): Promise<{ message: string }> {
        const response = await fetch(`${API_BASE_URL}/dpr/${jobId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete DPR');
        }

        return response.json();
    }
};
