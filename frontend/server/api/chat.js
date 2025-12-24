/**
 * Chat API Route
 * Express server endpoint for handling chat requests (Gemini)
 */

import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

const SYSTEM_PROMPT = `You are DevHub AI, a friendly senior software engineer assistant. Your role is to help developers with:

- JavaScript, React, Next.js, Node.js
- Data Structures and Algorithms (DSA)
- Interview preparation
- Code debugging and best practices
- Career advice for developers

Keep your responses:
- Short, clear, and beginner-friendly
- Practical with code examples when helpful
- Encouraging and supportive
- Focused on helping developers learn and grow

Always be professional, friendly, and ready to help!`

router.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body

    // Validate request
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        reply: '',
        error: 'Message is required and cannot be empty',
      })
    }

    if (message.length > 5000) {
      return res.status(400).json({
        reply: '',
        error: 'Message is too long (max 5000 characters)',
      })
    }

    // Check API key
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY

    if (!apiKey) {
      return res.status(500).json({
        reply: '',
        error: 'Gemini API key is not configured. Please set GEMINI_API_KEY environment variable.',
      })
    }

    // Initialize Gemini client
    const genAI = new GoogleGenerativeAI(apiKey)

    // Use a currently supported Gemini chat model.
    // Prefer an explicit env override, otherwise default to gemini-2.0-flash.
    const modelId = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
    console.log('Using Gemini model ID:', modelId)

    const model = genAI.getGenerativeModel({
      model: modelId,
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    })

    // Build conversation history - CRITICAL: Must start with 'user' role
    // Filter and format history, ensuring proper alternation (user -> model -> user -> model)
    let chatHistory = []
    
    if (Array.isArray(history) && history.length > 0) {
      chatHistory = history
        .filter(msg => {
          // Only include messages with valid role and content
          if (!msg || !msg.role || !msg.content) return false
          const role = msg.role.toLowerCase()
          return (role === 'user' || role === 'assistant') && 
                 typeof msg.content === 'string' && 
                 msg.content.trim() !== ''
        })
        .slice(-20) // Keep last 20 messages to avoid token limits
        .map(msg => ({
          role: msg.role.toLowerCase() === 'user' ? 'user' : 'model', // Convert 'assistant' to 'model'
          parts: [{ text: String(msg.content).trim() }],
        }))

      // CRITICAL: Ensure history starts with 'user' role (Gemini requirement)
      // Remove ANY leading 'model' messages - this is mandatory
      while (chatHistory.length > 0 && chatHistory[0].role !== 'user') {
        console.warn('Removing invalid leading message with role:', chatHistory[0].role)
        chatHistory = chatHistory.slice(1)
      }
    }

    // Debug logging
    console.log('=== Chat History Debug ===')
    console.log('Original history length:', history.length)
    console.log('Formatted history length:', chatHistory.length)
    if (chatHistory.length > 0) {
      console.log('First role:', chatHistory[0].role)
      console.log('Last role:', chatHistory[chatHistory.length - 1].role)
      console.log('History roles:', chatHistory.map(h => h.role).join(' -> '))
    } else {
      console.log('No history - starting fresh conversation')
    }

    // Build chat configuration
    // ROOT CAUSE FIX: Don't use systemInstruction in startChat - it's already in getGenerativeModel
    const chatConfig = {}
    
    // Only add history if it exists, starts with 'user', and is valid
    if (chatHistory.length > 0) {
      if (chatHistory[0].role === 'user') {
        chatConfig.history = chatHistory
        console.log('Added history to chat config')
      } else {
        console.error('ERROR: History does not start with user role!', chatHistory[0])
        // Don't add invalid history - start fresh
        chatHistory = []
      }
    }

    console.log('Starting chat with config:', {
      hasHistory: !!chatConfig.history,
      historyLength: chatConfig.history?.length || 0,
    })

    // Start chat session
    const chat = model.startChat(chatConfig)

    // Send the current user message
    console.log('Sending message:', message.substring(0, 50) + '...')
    const result = await chat.sendMessage(message.trim())
    const response = await result.response
    const text = response.text()
    console.log('Received response:', text.substring(0, 50) + '...')

    res.json({
      reply: text,
    })
  } catch (error) {
    console.error('Chat API error:', error)

    // Handle specific errors
    if (error.message?.includes('API key') || error.message?.includes('invalid')) {
      return res.status(401).json({
        reply: '',
        error: 'Invalid API key. Please check your GEMINI_API_KEY environment variable.',
      })
    }

    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      return res.status(429).json({
        reply: '',
        error: 'Rate limit exceeded. Please try again in a moment.',
      })
    }

    res.status(500).json({
      reply: '',
      error: error.message || 'An error occurred while processing your request.',
    })
  }
})

export default router

