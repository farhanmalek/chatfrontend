'use client'
import { useAuth } from '@/app/context/useAuth'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from "yup"

type LoginFormInputs = {
  userName: string,
  password: string,
}

const validation = Yup.object().shape({
  userName: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),

})

const Login = () => {

const { loginUser } = useAuth(); //bring in loginUser from context
const {register, handleSubmit, formState:{errors}} = useForm<LoginFormInputs>({resolver: yupResolver(validation)})

const handleLogin = (form: LoginFormInputs) => {
  loginUser(form.userName, form.password);
}

  return (
    <div className="rounded-lg flex flex-col">
    <form className="flex flex-col gap-4 p-5 justify-center" onSubmit={handleSubmit(handleLogin)}>
      <label className="input flex items-center gap-2 bg-transparent border border-b-white rounded-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4 opacity-70"
        >
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
        </svg>
        <input type="text" className="grow" placeholder="Username" {...register("userName")} />
      </label>
      {errors.userName ? <p className=''>{errors.userName.message}</p> : ""}
      <label className="input flex items-center gap-2 bg-transparent border border-b-white rounded-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clipRule="evenodd"
          />
        </svg>
        <input type="password" className="grow"  {...register("password")}/>
        
      </label>
      {errors.password ? <p>{errors.password.message}</p> : ""}
      <button className="border rounded-lg p-2" type='submit' >Login</button>

    </form>
    <p className='pl-5'>New here? Sign up <Link href='/register' className='underline cursor-pointer'> here</Link></p>
  </div>
  )
}

export default Login