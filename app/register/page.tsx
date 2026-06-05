"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { authClient } from "@/lib/auth-client"
import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validations/auth"

export default function RegisterPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "FREELANCER",
    },
  })

  async function onSubmit(data: RegisterFormValues) {
    try {
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
      })

      if (result.data) {
        router.push("/login")
      } else {
        alert(result.error?.message ?? "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
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
          <h1 className="text-4xl font-bold">Create Account</h1>
          <p className="text-gray-500 mt-2">Join FreelanceHub today</p>
        </div>

        <div>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-4 rounded-xl"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
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

        <div>
          <select
            className="w-full border p-4 rounded-xl"
            {...register("role")}
          >
            <option value="FREELANCER">Freelancer</option>
            <option value="CLIENT">Client</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white p-4 rounded-xl disabled:opacity-50"
        >
          {isSubmitting ? "Creating Account..." : "Register"}
        </button>

        <p className="text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
