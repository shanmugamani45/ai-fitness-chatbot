# AI Fitness Chatbot

Live Demo: https://ai-fitness-chatbot-version-2.vercel.app


## Preview
<img width="1919" height="973" alt="image" src="https://github.com/user-attachments/assets/aa4dd89d-b7d0-4f4f-813b-1ac6b3215927" />


<img width="1919" height="971" alt="image" src="https://github.com/user-attachments/assets/2e5ae796-32c6-4da4-a0f1-eac5b4960ee6" />


A full-stack AI fitness chatbot built with **FastAPI**, **React (Vite)** and **Groq LLM**.  
It generates workout plans, diet suggestions, and fitness advice.


## Tech Stack
- FastAPI
- React + Vite
- Groq LLM
- Render (Backend Deployment)
- Vercel (Frontend Deployment)
  

# 🚀 Features
## 🤖 AI Fitness Assistant

An intelligent chatbot that provides fitness guidance including workout plans, diet suggestions, injury prevention tips, and general fitness advice using an LLM-powered backend.


## 💬 Interactive Chat Interface

A modern ChatGPT-style chat UI where users can send prompts and receive AI responses in real time.


## Features include:

- smooth message flow

- auto scrolling chat

- loading indicators

- typing animation effect


## 🗂 Multiple Chat Sessions

Users can manage multiple conversations.


## Capabilities:

- create new chats

- switch between chats

- delete chats

- automatic chat title generation based on the first prompt
  

## 💾 Persistent Chat History

Chat sessions are stored using browser LocalStorage, allowing conversations to remain available even after refreshing the page.


## 📝 Markdown AI Responses

AI responses support Markdown formatting including:

- headings

- bullet lists

- structured workout plans

- readable fitness instructions

- Rendering is handled with ReactMarkdown for a clean UI.
  

## ⚡ FastAPI Backend API

The backend exposes a REST API endpoint for chat communication.


## Example endpoint:

POST /chat


### Example request:

{
  "message": "Create a 3 day workout plan"
}


## 🌐 Cloud Deployment

The application is fully deployed using modern cloud platforms.

### Frontend:

- Vercel

### Backend:

- Render

This enables the chatbot to be publicly accessible via a web URL.


## 🧠 AI Integration

The chatbot integrates with an LLM API to generate intelligent fitness responses including:

- personalized workout plans

- diet guidance

- training tips

- recovery strategies
  

## 🧱 Full-Stack Architecture

The project demonstrates a modern full-stack AI application architecture.

### Frontend:

React + Vite

### Backend:

FastAPI

### AI Layer:

Groq / Gemini LLM API

### Deployment:

Vercel + Render


## 🧪 Example Prompts

Users can ask the chatbot things like:

- Create a 4 day muscle gain workout plan
- Suggest a diet plan for weight loss
- How can I avoid shoulder injuries while bench pressing?
