# Railway Deployment Guide for JobSeeker

## Prerequisites

1. A [Railway](https://railway.app/) account
2. The [Railway CLI](https://docs.railway.app/develop/cli) installed (optional, for local development)

## Deployment Steps

### 1. Set Up Your Railway Project

1. Log in to your Railway account
2. Create a new project
3. Add a PostgreSQL database service to your project

### 2. Configure Environment Variables

Set the following environment variables in your Railway project settings:

- `SECRET_KEY`: Your Django secret key
- `DEBUG`: Set to "False" for production
- `EMAIL_HOST_USER`: Your email address for sending emails
- `EMAIL_HOST_PASSWORD`: Your email app password
- `DATABASE_URL`: This will be automatically set by Railway when you add a PostgreSQL service
- `GOOGLE_CLIENT_ID` and `GOOGLE_SECRET`: If you're using Google OAuth

### 3. Deploy Your Code

#### Option 1: Deploy from GitHub

1. Connect your GitHub repository to Railway
2. Railway will automatically detect the `railway.toml` configuration
3. Deploy your application

#### Option 2: Deploy using Railway CLI

```bash
# Login to Railway
railway login

# Link to your project
railway link

# Deploy your application
railway up
```

### 4. Run Migrations

After deployment, run migrations to set up your database:

```bash
railway run python manage.py migrate
```

### 5. Create a Superuser (Optional)

Create an admin user to access the Django admin panel:

```bash
railway run python manage.py createsuperuser
```

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues, verify:

1. The `DATABASE_URL` environment variable is correctly set
2. Your PostgreSQL service is running
3. The `dj-database-url` package is installed

### Static Files Not Loading

If static files aren't loading properly:

1. Ensure `whitenoise` is correctly configured in settings.py
2. Run `python manage.py collectstatic` manually if needed

### Application Errors

Check the Railway logs for detailed error messages:

```bash
railway logs
```

## Maintenance

### Updating Your Application

Push changes to your GitHub repository or use the Railway CLI:

```bash
railway up
```

### Database Backups

Use Railway's database backup feature to regularly backup your data.