create table
    smoothindex.users (
        id bigint primary key generated always as identity,
        google_id text not null unique,
        email text not null unique,
        name text,
        profile_picture text,
        created_at timestamp
        with
            time zone default now () not null
    );

create table
    smoothindex.user_domains (
        id bigint primary key generated always as identity,
        user_id bigint not null references users (id),
        domain text not null,
        status text check (status in ('NEW', 'PROCESSING', 'PROCESSED')) not null,
        added_at timestamp
        with
            time zone default now () not null
    );

alter table smoothindex.user_domains
add column enabled_for_autoindexing boolean default false not null;