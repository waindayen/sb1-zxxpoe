-- Create the passports table
create table public.passports (
    id uuid default gen_random_uuid() primary key,
    first_name text not null,
    last_name text not null,
    date_of_birth date not null,
    nationality text not null,
    passport_number text not null unique,
    issue_date date not null,
    expiry_date date not null,
    photo text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.passports enable row level security;

-- Create policy to allow all operations for now (you can restrict this later)
create policy "Enable all operations for passports" on public.passports
    for all
    using (true)
    with check (true);

-- Create storage bucket for passport photos
insert into storage.buckets (id, name, public) 
values ('passport-photos', 'passport-photos', true);

-- Create policy to allow public access to passport photos
create policy "Public Access" on storage.objects for all using (
    bucket_id = 'passport-photos'
);

-- Create function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger handle_updated_at
    before update on public.passports
    for each row
    execute function public.handle_updated_at();

-- Create indexes for better query performance
create index idx_passports_passport_number on public.passports(passport_number);
create index idx_passports_last_name on public.passports(last_name);
create index idx_passports_created_at on public.passports(created_at);