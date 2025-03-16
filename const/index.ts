// Define slide type
export interface Slide {
    title: string;
    image: any;
}

export const slides: Slide[] = [
    { title: "Slide 1", image: require("../assets/images/slide_1.png") },
    { title: "Slide 2", image: require("../assets/images/slide_2.png") },
    { title: "Slide 3", image: require("../assets/images/slide_3.png") },
    { title: "Slide 4", image: require("../assets/images/slide_4.png") },
    { title: "Slide 5", image: require("../assets/images/slide_5.png") },
];

export const size: string[] = ["S", "M", "L", "XL"];

export const statusTypes = [
    { key: 'pending', label: 'Chờ xác nhận' },
    { key: 'processing', label: 'Đang xử lý' },
    { key: 'shipping', label: 'Đang giao' },
    { key: 'delivered', label: 'Đã giao' },
    { key: 'cancelled', label: 'Đã hủy' }
];

export const statusColors = {
    pending: { bg: '#FEF3C7', text: '#D97706' },
    processing: { bg: '#DBEAFE', text: '#2563EB' },
    shipping: { bg: '#E0F2FE', text: '#0284C7' },
    delivered: { bg: '#DCFCE7', text: '#16A34A' },
    cancelled: { bg: '#FEE2E2', text: '#DC2626' }
};

export const statusTranslations = {
    pending: 'Chờ xác nhận',
    processing: 'Đang xử lý',
    shipping: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy'
};