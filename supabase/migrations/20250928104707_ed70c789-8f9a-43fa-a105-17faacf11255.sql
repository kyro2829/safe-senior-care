-- Fix RLS policy issue for user_roles during signup
-- Drop the existing restrictive policy that prevents signup
DROP POLICY IF EXISTS "Only caregivers can insert roles" ON public.user_roles;

-- Create a more permissive policy that allows users to create their own role during signup
CREATE POLICY "Users can create their own role during signup" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Also allow service role to insert roles (for admin operations)
CREATE POLICY "Service role can insert any role" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');