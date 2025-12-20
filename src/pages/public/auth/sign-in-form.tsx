import { cn } from "@/shared/lib"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Form, FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage, } from "@/shared/components/ui/form"

import AuthLayout from "./Layout"


import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/app/providers/AuthProvider"
import { Link } from "react-router-dom"
import { useState } from "react"
// Schema with trimming enabled
const loginSchema = z.object({
  email: z
    .string()
    .trim() // Removes leading/trailing spaces
    .min(1, "Email is required")
    .email("Enter a valid email"),
  password: z
    .string()
    .trim() // Removes leading/trailing spaces
    .min(4, "Password must be at least 4 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
   const [showPassword, setShowPassword] = useState(false)
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@gmail.com",
      password: "admin",
    },
    mode: "onBlur",
  })

  const { isSubmitting } = form.formState
 
  const {login} = useAuth() ;
  const onSubmit = async (data: LoginFormValues) => {
    // Data is automatically trimmed by Zod here before reaching this function
    //  console.log("Submitted Data:", data)
     await login(data)
    
  }

  return (
    <AuthLayout>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="p-6 md:p-8"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-muted-foreground text-balance">
                      Login to your Diet Plan account
                    </p>
                  </div>

                  <div className="grid gap-4">
                    {/* Email Field */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="m@example.com"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password Field */}
                    {/* Password Field */}
<FormField
  control={form.control}
  name="password"
  render={({ field }) => (
    <FormItem>
      <div className="flex items-center">
        <FormLabel>Password</FormLabel>
        <Link
          to="/forget-password"
          className="ml-auto text-sm underline-offset-2 hover:underline"
        >
          Forgot your password?
        </Link>
      </div>
      
      {/* FIX: Create a relative container for positioning.
         FormControl must wrap ONLY the Input.
      */}
      <div className="relative">
        <FormControl>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            className="pr-10"
            {...field}
          />
        </FormControl>
        
        {/* The toggle button sits outside FormControl but inside the relative div */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          tabIndex={-1}
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
              <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.8 0 1.6-.1 2.38-.31" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      <FormMessage />
    </FormItem>
  )}
/>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                  </div>

                  {/* Manual Separator Implementation since we removed FieldSeparator */}
                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Button variant="outline" type="button" className="w-full">
                      <span className="sr-only">Login with Apple</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                    </Button>
                    <Button variant="outline" type="button" className="w-full">
                      <span className="sr-only">Login with Google</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                         <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                      </svg>
                    </Button>
                    <Button variant="outline" type="button" className="w-full">
                      <span className="sr-only">Login with Meta</span>
                      <svg 
                         xmlns="http://www.w3.org/2000/svg" 
                         width="24" 
                         height="24" 
                         viewBox="0 0 24 24" 
                         fill="none" 
                         stroke="currentColor" 
                         strokeWidth="2" 
                         strokeLinecap="round" 
                         strokeLinejoin="round" 
                         className="h-5 w-5"
                      >
                         <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                      </svg>
                    </Button>
                  </div>

                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to="/sign-up" className="underline underline-offset-4">
                      Sign up
                    </Link>
                  </div>
                </div>
              </form>
            </Form>

            <div className="bg-muted relative hidden md:block">
              <img
                src="./assets/login-poster.jpg"
                alt="Login illustration"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  )
}