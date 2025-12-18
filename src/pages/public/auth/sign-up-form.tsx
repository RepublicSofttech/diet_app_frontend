import { useState } from "react"
import { Link,useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from 'sonner';
import { userApi } from "@/shared/api/user.api";
// Import your separated schema
import { signupSchema ,type SignupFormValues } from "@/shared/lib/signup.schema"; 

import { cn } from "@/shared/lib";
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form"
import { FieldSeparator } from "@/shared/components/ui/field"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
  })

  const { isSubmitting } = form.formState  
  const onSubmit = async (data: SignupFormValues) => {
  try {
    console.log("Sending Data:", data);
  
    const result = await userApi.register(data);

    console.log("Registration Successful:", result);
    
    // 2. Replace alert with toast.success
    toast.success("Account created successfully!");
    setTimeout(() => {
      navigate('/sign-in');
    }, 3000);
  } catch (error: any) {
    console.error("Registration Error:", error);
    
    // Set form error
    form.setError("root", { 
      message: error.message || "Something went wrong. Please try again." 
    });
    
    // 3. Replace alert with toast.error
    toast.error(error.message || "Registration failed");
  }
}
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
      <div className={cn("w-full max-w-6xl", className)} {...props}>
        <Card className="overflow-hidden p-0 shadow-xl border-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            
            {/* --- LEFT SIDE: FORM --- */}
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="flex flex-col justify-center p-6 md:p-8"
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
                  <p className="text-muted-foreground text-sm">
                    Join us to start your health journey
                  </p>
                </div>

                <div className="space-y-5">
                  
                  {/* Row 1: Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem className="relative space-y-1">
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          {/* Absolute position prevents layout shift/jumping */}
                          <FormMessage className="absolute -bottom-5 left-0 text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem className="relative space-y-1">
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage className="absolute -bottom-5 left-0 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Row 2: Email & Password */}
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="relative space-y-1">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="m@example.com" {...field} />
                          </FormControl>
                          <FormMessage className="absolute -bottom-5 left-0 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="relative space-y-1">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Enter Password" 
                                {...field} 
                                className="pr-10" 
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                tabIndex={-1}
                              >
                                {showPassword ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.8 0 1.6-.1 2.38-.31"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="absolute -bottom-5 left-0 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full mt-8" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Sign Up"}
                </Button>

                {/* Social Login */}
                <FieldSeparator className="my-4 text-xs uppercase text-muted-foreground">
                  Or register with
                </FieldSeparator>
                
                <div className="grid grid-cols-3 gap-3">
                   <Button variant="outline" type="button" className="w-full">
                     <span className="sr-only">Apple</span>
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>
                   </Button>
                   <Button variant="outline" type="button" className="w-full">
                     <span className="sr-only">Google</span>
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
                   </Button>
                   <Button variant="outline" type="button" className="w-full">
                     <span className="sr-only">Meta</span>
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"/></svg>
                   </Button>
                </div>

                <div className="text-center text-sm mt-6">
                  Already have an account?{" "}
                  <Link to="/sign-in" className="text-primary font-semibold hover:underline">
                    Sign in
                  </Link>
                </div>

              </form>
            </Form>

            {/* --- RIGHT SIDE: IMAGE --- */}
            <div className="relative hidden bg-slate-900 md:block min-h-full">
              <img
                src="./assets/login-poster.jpg"
                alt="Lifestyle"
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
              <div className="absolute bottom-10 left-10 right-10 text-white">
                <h2 className="text-3xl font-bold mb-2">Track your progress</h2>
                <p className="text-slate-200">Join thousands of others achieving their health goals today.</p>
              </div>
            </div>
            
          </CardContent>
        </Card>
      </div>
    </div>
  )
}