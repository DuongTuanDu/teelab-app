import CryptoJS from "crypto-js";

const CLOUDINARY_NAME: string = process.env.EXPO_PUBLIC_CLOUDINARY_NAME!;
const API_KEY: string = process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY!;
const SECRET_KEY: string = process.env.EXPO_PUBLIC_CLOUDINARY_SECRET_KEY!;

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/auto/upload`;
const DESTROY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/destroy`;

interface CloudinaryResponse {
    secure_url: string;
    public_id: string;
    [key: string]: any;
}

export const uploadFile = async (file: File): Promise<CloudinaryResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "teelab-upload");

    try {
        const response = await fetch(UPLOAD_URL, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CloudinaryResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        throw error;
    }
};

export const deleteFile = async (publicId: string): Promise<CloudinaryResponse> => {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = CryptoJS.SHA1(
        `public_id=${publicId}&timestamp=${timestamp}${SECRET_KEY}`
    ).toString();

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("signature", signature);
    formData.append("api_key", API_KEY);
    formData.append("timestamp", timestamp.toString());

    try {
        const response = await fetch(DESTROY_URL, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CloudinaryResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error deleting file from Cloudinary:", error);
        throw error;
    }
};
