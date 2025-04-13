# GitHub User Analyzer

This is a frontend-only React + TypeScript application that analyzes any public GitHub user's activity. It displays a list of public repositories and a daily commit chart using GitHub's public API.

## Features

- Displays public repositories of any GitHub user
- Visualizes daily commit activity using a bar chart
- Clean UI using ShadCN and Tailwind CSS
- Built entirely with frontend technologies (React, TypeScript)

## Technologies Used

- React (with Vite)
- TypeScript
- Tailwind CSS
- ShadCN UI components
- Recharts (for commit chart)

## How to Run Locally

### 1. Extract the Zip

Extract the downloaded `.zip` file to your local machine.

### 2. Install Node.js (if not already installed)

Install Node.js from [https://nodejs.org/](https://nodejs.org/)  
Recommended version: **18.x or above**

### 3. Install Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

### 4. Start the Development Server

npm run dev

The app will be available at:
http://localhost:5173 (Check in terminal whther the port is same or not)

## ShadCN UI Setup

This project uses components from the ShadCN UI library.

Required Components
The following ShadCN components are used:

- Input

- Button

- Card

## Installation (If Setting Up Fresh)

# Step 1: Initialize ShadCN

npx shadcn-ui@latest init

# Step 2: Add Components

npx shadcn-ui@latest add input
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
