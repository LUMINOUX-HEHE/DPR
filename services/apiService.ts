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

        const response = await fetch(`${API_BASE_URL}/dpr/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to upload DPR');
        }

        return response.json();
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
        const response = await fetch(`${API_BASE_URL}/dpr/list`);

        if (!response.ok) {
            throw new Error('Failed to fetch DPR list');
        }

        return response.json();
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
