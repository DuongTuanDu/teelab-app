// Define slide type
export interface Slide {
    title: string;
    image: any;
}

export const slides: Slide[] = [
    { title: "Slide 1", image: require("../../assets/images/slide_1.png") },
    { title: "Slide 2", image: require("../../assets/images/slide_2.png") },
    { title: "Slide 3", image: require("../../assets/images/slide_3.png") },
    { title: "Slide 4", image: require("../../assets/images/slide_4.png") },
    { title: "Slide 5", image: require("../../assets/images/slide_5.png") },
];

export const size: string[] = ["S", "M", "L", "XL"];
