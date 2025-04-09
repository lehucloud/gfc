// frontend/src/stores/auth.ts
import SubscribeForm from '@/views/SubscribesView/components/SubscribeForm.vue';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: '' ,
        auth_data: '',
        subscribeUrl: '',
        subscribePlane: null
    }),
    actions: {
        setToken(token: string) {
            this.token = token;
        },
        clearToken() {
            this.token = '';
        },
        setAuthData(data: string) {
            this.auth_data = data;
        },
        clearAuthData() {
            this.auth_data = '';
        }
    }
});