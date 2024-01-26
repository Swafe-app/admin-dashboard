'use client'

import '@/app/(auth)/login/login.css'
import axiosBackInstance from '@/services/axiosInstances/axiosBackInstance'
import { setActive, setInfo } from '@/store/adminSlice'
import { useTypeDispatch } from '@/store/hooks'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import { Alert, AlertColor, Button, CircularProgress, FormControl, IconButton, Input, TextField } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [emailValue, setEmailValue] = useState<{ error: boolean, value: string }>({ error: false, value: '' })
  const [passwordValue, setPasswordValue] = useState<{ error: boolean, value: string }>({ error: false, value: '' })
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState({
    severity: '',
    message: '',
  })
  const dispatch = useTypeDispatch()
  const router = useRouter()

  const login = async () => {
    setLoading(true)
    const response = await axiosBackInstance.post('/users/login', {
      email: emailValue.value,
      password: passwordValue.value,
    })
    return response.data.data
  }

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: response => {
      setLoading(false)
      if (response.user.role !== 'admin') {
        setErrorMessage({
          severity: 'error',
          message: 'Vous n\'avez pas les droits pour accéder à cette page.',
        })
        return
      }
      setErrorMessage({
        severity: 'success',
        message: 'Connecté avec succès.',
      })
      dispatch(setInfo(response.user))
      dispatch(setActive(true))
      localStorage.setItem('swafe-admin', response.token)
      router.push('/')
    },
    onError: () => {
      setLoading(false)
      setErrorMessage({
        severity: 'error',
        message: 'Identifiant ou mot de passe incorrect.',
      })
    }
  })

  const submitForm = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault()
    if (emailValue.value !== '' && passwordValue.value !== '') {
      mutation.mutate()
    }
    if (emailValue.value === '' || passwordValue.value === '') {
      if (emailValue.value === '') setEmailValue({
        error: true,
        value: emailValue.value
      })
      if (passwordValue.value === '') setPasswordValue({
        error: true,
        value: passwordValue.value
      })
      setErrorMessage({
        severity: 'error',
        message: "Veuillez remplir tous les champs."
      })
    }
  }

  return (
    <section id="loginSection" className="section-login">
      <form className="form-login" onSubmit={submitForm}>
        <div className='title-logo'>
          <Image
            src='logo_dark.svg' alt='Swafe logo'
            width={40}
            height={40}
          />
          <span>Swafe Admin</span>
        </div>

        <span className="subtitle-login">
          Veuillez saisir vos informations
        </span>

        {errorMessage.message && (
          <Alert
            sx={{ marginBottom: '25px' }}
            action={
              <IconButton
                size="small"
                onClick={() => setErrorMessage({ severity: '', message: '' })}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            severity={errorMessage.severity as AlertColor}
          >
            {errorMessage.message}
          </Alert>
        )}

        <div className="input-group-login">
          <FormControl error={emailValue.error}>
            <TextField
              onChange={e => setEmailValue({ error: false, value: e.target.value })}
              value={emailValue.value}
              placeholder="Identifiant"
              type="text"
              autoComplete="email"
            />
          </FormControl>
          <FormControl error={passwordValue.error}>
            <TextField
              onChange={e => setPasswordValue({ error: false, value: e.target.value })}
              value={passwordValue.value}
              placeholder="Mot de passe"
              type={isPasswordVisible ? 'text' : 'password'}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    edge="end"
                  >
                    {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                )
              }}
            />
          </FormControl>
          <Button
            variant='contained'
            type="submit"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Connexion
          </Button>
        </div>
      </form>
    </section>
  )
}
