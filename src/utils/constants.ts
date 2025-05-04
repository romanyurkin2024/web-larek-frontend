export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^\+?\d{11,15}$/;
export const addressRegex = /^[a-zA-Zа-яА-Я0-9\s\-.,]{5,}$/u;