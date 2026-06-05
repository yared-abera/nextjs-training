"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { authClient } from "@/lib/auth-client"
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth"

export default function LoginPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      })

      if (result.data) {
        router.refresh()
        router.push("/")
      } else {
        alert(result.error?.message ?? "Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Something went wrong")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-10 bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-5 bg-white p-8 rounded-2xl shadow"
      >
        <div>
          <h1 className="text-4xl font-bold">Welcome Back</h1>

          <p className="text-gray-500 mt-2">
            Login to your FreelanceHub account
          </p>
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-4 rounded-xl"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-4 rounded-xl"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white p-4 rounded-xl disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-500 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}
