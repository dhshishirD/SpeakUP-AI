/**
 * SpeakUP AI - Real Supabase Authentication & Postgres Database Integration
 * Features:
 * 1. Real Google OAuth Redirect (signInWithOAuth)
 * 2. Real Email + Password Auth (signUp / signInWithPassword)
 * 3. Real Postgres Database Persistence (user_vocab_progress)
 */

const SUPABASE_URL = window.ENV_SUPABASE_URL || 'https://aizpmilyxcmvtbxyodxy.supabase.co';
const SUPABASE_ANON_KEY = window.ENV_SUPABASE_ANON_KEY || 'sb_publishable_5X8m9ohyHTqaq2KC4HSg4A_kdePALwO';

let supabaseClient = null;

if (typeof supabase !== 'undefined') {
    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("🟢 Supabase Client initialized for https://aizpmilyxcmvtbxyodxy.supabase.co");
    } catch(e) {
        console.error("Supabase init error:", e);
    }
}

const RealAuthEngine = {
    user: null,

    async init() {
        console.log("🔐 RealAuthEngine Initializing Supabase Auth...");
        if (!supabaseClient) {
            console.warn("Supabase SDK loading or placeholder mode active.");
            return;
        }

        try {
            // Check active session
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session && session.user) {
                this.user = session.user;
                this.onAuthSuccess(session.user);
            }

            // Listen to auth state changes (Google OAuth redirect return)
            supabaseClient.auth.onAuthStateChange((event, session) => {
                console.log("Supabase Auth Event:", event);
                if (session && session.user) {
                    this.user = session.user;
                    this.onAuthSuccess(session.user);
                } else if (event === 'SIGNED_OUT') {
                    this.user = null;
                    this.onSignOut();
                }
            });
        } catch(e) {
            console.error("Supabase Session Check Error:", e);
        }
    },

    // 1. REAL GOOGLE OAUTH REDIRECT
    async signInWithGoogle() {
        if (!supabaseClient) {
            alert("⚠️ Supabase Client Not Loaded.");
            return;
        }

        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });

        if (error) {
            console.error("Google OAuth Error:", error.message);
            alert("Google Sign-In Error: " + error.message);
        }
    },

    // 2. REAL EMAIL + PASSWORD SIGN UP & SIGN IN
    async signUpWithEmail(email, password, fullName) {
        if (!supabaseClient) {
            alert("⚠️ Supabase Client Not Loaded.");
            return null;
        }

        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { full_name: fullName }
            }
        });

        if (error) {
            alert("Sign-Up Error: " + error.message);
            return null;
        }

        if (data.user) {
            alert("🎉 Sign-Up Successful! Welcome to SpeakUP AI.");
            this.user = data.user;
            this.onAuthSuccess(data.user);
            return data.user;
        }
    },

    async signInWithEmail(email, password) {
        if (!supabaseClient) {
            alert("⚠️ Supabase Client Not Loaded.");
            return null;
        }

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            alert("Sign-In Error: " + error.message);
            return null;
        }

        if (data.user) {
            this.user = data.user;
            this.onAuthSuccess(data.user);
            alert(`🎉 Welcome back, ${data.user.email}! Real session authenticated.`);
            return data.user;
        }
    },

    // 3. REAL POSTGRES DATABASE PERSISTENCE
    async saveProgressToPostgres(progressData) {
        if (!supabaseClient || !this.user) return;

        try {
            const payload = {
                user_id: this.user.id,
                email: this.user.email,
                favorites: progressData.favorites || [],
                weak_words: progressData.weakWords || [],
                mastered_words: progressData.masteredWords || [],
                xp_total: progressData.xpTotal || 0,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabaseClient
                .from('user_vocab_progress')
                .upsert(payload, { onConflict: 'user_id' });

            if (error) console.warn("Postgres Save Note:", error.message);
            else console.log("✅ Saved progress to Supabase Postgres database!");
        } catch (e) {
            console.error("Database save failed:", e);
        }
    },

    async loadProgressFromPostgres() {
        if (!supabaseClient || !this.user) return null;

        try {
            const { data, error } = await supabaseClient
                .from('user_vocab_progress')
                .select('*')
                .eq('user_id', this.user.id)
                .single();

            if (error) {
                console.warn("Postgres Load Note:", error.message);
                return null;
            }
            return data;
        } catch (e) {
            console.error("Database load failed:", e);
            return null;
        }
    },

    async signOut() {
        if (supabaseClient) {
            await supabaseClient.auth.signOut();
        }
        this.user = null;
        this.onSignOut();
    },

    onAuthSuccess(user) {
        const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || "Learner";
        window.currentUser = {
            id: user.id,
            name: userName,
            email: user.email,
            avatar: user.user_metadata?.avatar_url || '👨‍🎓',
            isPaid: true
        };

        if (typeof updateUserUI === 'function') updateUserUI();
        if (typeof VocabEngine !== 'undefined') {
            this.loadProgressFromPostgres().then(remoteData => {
                if (remoteData) {
                    VocabEngine.userProgress.favorites = new Set(remoteData.favorites || []);
                    VocabEngine.userProgress.weakWords = new Set(remoteData.weak_words || []);
                    VocabEngine.userProgress.masteredWords = new Set(remoteData.mastered_words || []);
                    VocabEngine.userProgress.xpTotal = remoteData.xp_total || 120;
                    VocabEngine.renderFilterBars();
                    VocabEngine.renderCards();
                }
            });
        }

        // Close auth modal if open
        const modal = document.getElementById('loginModal');
        if (modal) modal.style.display = 'none';
    },

    onSignOut() {
        window.currentUser = null;
        if (typeof updateUserUI === 'function') updateUserUI();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    RealAuthEngine.init();
});
