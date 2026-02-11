# Deployment Guide for Back4App

This guide explains how to deploy your Strapi backend and Vite frontend to [Back4App Containers](https://www.back4app.com/docs-containers).

## Prerequisites
1.  **GitHub Account**: Ensure your project is pushed to a GitHub repository.
2.  **Back4App Account**: Log in to [Back4App](https://dashboard.back4app.com/).

---

## Part 1: Deploying the Backend (Strapi)

1.  **Create New App**:
    *   Go to the Back4App Dashboard.
    *   Click **"New App"** and select **"Containers"**.
2.  **Connect GitHub**:
    *   Connect your GitHub account and **Select this Repository**.
3.  **Configure Service**:
    *   **App Name**: e.g., `diaaru-backend`
    *   **Root Directory**: Keep as `./` (or leave empty).
    *   **Dockerfile Path**: `Dockerfile` (default).
    *   **Port**: `1337` (Important: Set this if it asks, default is usually 80 or auto-detected).
4.  **Environment Variables**:
    *   Add the following variables (generate random secure strings for secrets):
        *   `HOST`: `0.0.0.0`
        *   `PORT`: `1337`
        *   `NODE_ENV`: `production`
        *   `APP_KEYS`: `randomString1,randomString2`
        *   `API_TOKEN_SALT`: `randomString`
        *   `ADMIN_JWT_SECRET`: `randomString`
        *   `TRANSFER_TOKEN_SALT`: `randomString`
        *   `JWT_SECRET`: `randomString`
        *   *Note: Using SQLite (`.tmp/data.db`) in containers means data will be reset on every deployment. For production, connect a PostgreSQL database.*
5.  **Deploy**: Click **"Deploy App"**.
6.  **Copy URL**: Once deployed, copy the App URL (e.g., `https://diaaru-backend.b4a.run`).

---

## Part 2: Deploying the Frontend (Vite)

1.  **Create New App**:
    *   Go back to Dashboard -> **"New App"** -> **"Containers"**.
2.  **Connect GitHub**:
    *   Select the **Same Repository**.
3.  **Configure Service**:
    *   **App Name**: e.g., `diaaru-frontend`
    *   **Root Directory**: Set this to `frontend` (**Crucial**: This tells Docker where to look).
    *   **Dockerfile Path**: `Dockerfile` (Relative to the root directory, so just `Dockerfile`).
    *   **Port**: `80` (Since we configured Nginx to listen on 80).
4.  **Environment Variables**:
    *   We need to tell the frontend where the backend is.
    *   Add the variable:
        *   `VITE_API_URL`: `https://diaaru-backend.b4a.run` (Replace with your actual Backend URL from Part 1).
    *   *Note: Since Vite builds at deploy time, this variable must be present during the build.*
5.  **Deploy**: Click **"Deploy App"**.

## Summary
- **Backend** runs on Port 1337 using the root Dockerfile.
- **Frontend** runs on Port 80 using the `frontend/Dockerfile`.
- Always redeploy the Frontend if the Backend URL changes.
