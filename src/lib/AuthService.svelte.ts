import type { User } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { browser } from '$app/environment';

class AuthService {
    user = $state<User | null>(null);
    loading = $state(true);
    error = $state<string | null>(null);

    async init(): Promise<void> {
        if (!browser) {
            this.loading = false;
            return;
        }
        const {
            data: { session }
        } = await supabase.auth.getSession();
        this.user = session?.user ?? null;
        this.loading = false;

        supabase.auth.onAuthStateChange((_event, session) => {
            this.user = session?.user ?? null;
        });
    }

    async signUp(email: string, password: string, name: string): Promise<string | null> {
        this.error = null;
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } }
        });
        if (error) this.error = error.message;
        return error?.message ?? null;
    }

    async signIn(email: string, password: string): Promise<string | null> {
        this.error = null;
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) this.error = error.message;
        return error?.message ?? null;
    }

    async signOut(): Promise<void> {
        await supabase.auth.signOut();
        this.user = null;
    }

    get isAuthenticated(): boolean {
        return !!this.user;
    }

    get userId(): string | null {
        return this.user?.id ?? null;
    }

    get userEmail(): string | null {
        return this.user?.email ?? null;
    }
}

export const authService = new AuthService();
