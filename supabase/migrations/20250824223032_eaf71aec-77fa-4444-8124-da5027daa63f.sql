-- Add foreign key relationship between testimonials and profiles
ALTER TABLE public.testimonials 
ADD CONSTRAINT testimonials_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;