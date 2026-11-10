import {create} from 'zustand';
import {persist} from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            role: null,
            name: null,
            // Called after a successful login/register
            // data = { token, role, name } (the AuthResponse from Spring Boot)
            login: (data) => set(
                { token: data.token,
                  role: data.role,
                  name: data.name,
                }
            ),

            // Clears everything out
            logout: () => set(
                { token: null,
                  role: null,
                  name: null,  
                }
            ),

        }),
        {
            name: 'auth-storage', // unique name
        }
    )
)