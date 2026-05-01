import { createContext, useContext, useEffect, useState } from 'react';
import { getUserProfile } from '../data/auth';
import { useRouter } from "next/router"

const AppContext = createContext();

export function AppWrapper({ children }) {
  const [profile, setProfile] = useState({})
  const [token, setToken] = useState("")
  const [profileLoading, setProfileLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  useEffect(() => {
    const authRoutes = ['/login', '/register']
    if (token) {
      localStorage.setItem('token', token)
      if (!authRoutes.includes(router.pathname)) {
        setProfileLoading(true)
        getUserProfile().then((profileData) => {
          if (profileData) {
            setProfile(profileData)
          }
        }).finally(() => {
          setProfileLoading(false)
        })
      }
    }
  }, [token])

  return (
    <AppContext.Provider value={{ profile, token, setToken, setProfile, profileLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
