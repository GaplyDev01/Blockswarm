import { ChatGroq } from "@langchain/groq";
import { ChatAnthropic } from "@langchain/anthropic";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Initialize API keys
const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
const anthropicApiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

// Use Anthropic Claude by default, fallback to Groq if not available
const useAnthropicByDefault = true;

export const getGroqModel = (modelName = "llama3-70b-8192") => {
  return new ChatGroq({
    apiKey: groqApiKey,
    model: modelName,
    temperature: 0.5,
  });
};

export const getAnthropicModel = (modelName = "claude-3-7-sonnet-20250219") => {
  return new ChatAnthropic({
    apiKey: anthropicApiKey,
    model: modelName,
    temperature: 0.5,
    // Setting additional Anthropic-specific parameters
    anthropicApiKey: anthropicApiKey,
    maxTokens: 1024, // Default max tokens
  });
};

// Get the appropriate model based on configuration
export const getModel = () => {
  if (useAnthropicByDefault && anthropicApiKey) {
    return getAnthropicModel();
  }
  return getGroqModel();
};

export const createTradeAnalysis = async (
  tokenName: string,
  currentPrice: number,
  marketData: any
) => {
  const model = getModel();

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are TradesXBT, an AI trading agent specializing in Solana ecosystem tokens. 
     You analyze market data and provide trading signals with high confidence. 
     Your analysis should be factual, precise, and focused on actionable insights.`],
    [
      "human",
      `Analyze the following token and provide a trading signal:
      Token: {token}
      Current Price: {price}
      Market Data: {marketData}
      
      Generate a comprehensive analysis including:
      1. Recommended action (BUY/SELL)
      2. Confidence level (0-100%)
      3. Target price (for 50% gain)
      4. Stop loss price
      5. Brief explanation of reasoning based on market conditions
      6. Risk/reward ratio
      
      Format your response as a JSON object with the following structure:
      {
        "action": "BUY" or "SELL",
        "confidence": number,
        "target": number,
        "stopLoss": number,
        "explanation": "string",
        "riskReward": number
      }
      `
    ],
  ]);

  const outputParser = new StringOutputParser();

  const chain = prompt.pipe(model).pipe(outputParser);

  try {
    const response = await chain.invoke({
      token: tokenName,
      price: currentPrice,
      marketData: JSON.stringify(marketData),
    });

    return JSON.parse(response);
  } catch (error) {
    console.error("Error generating trade analysis:", error);
    return null;
  }
};

export const chatWithAgent = async (message: string, chatHistory: Array<HumanMessage | AIMessage> = []) => {
  const model = getModel();

  const systemPrompt = `You are TradesXBT, an AI trading agent specializing in Solana ecosystem tokens.
  You provide concise, accurate information about crypto trading, market analysis, and investment strategies.
  When discussing tokens or market trends, focus on facts and be transparent about uncertainty.
  Do not make guaranteed price predictions or returns.
  
  If asked about specific tokens, you can provide:
  - ONLY provide analysis for Solana ecosystem tokens
  - For non-Solana tokens, politely explain that you specialize in Solana ecosystem analysis
  - Recent price performance
  - Market capitalization and volume
  - Technical analysis patterns (if valid)
  - News events that might be impacting the token

  IMPORTANT: After analyzing a token, always provide a sentiment score from 0-100 based on:
  - Recent price action
  - Volume trends in the 5min, 15min, and 30min timeframes
  - Market cap movement
  - Technical indicators
  
  Then display one of these ratings based on the score:
  - BEARISH 🔴 (score ≤ 35)
  - DYOR 🟡 (score 36-66)
  - BULLISH 🟢 (score ≥ 67)
  
  If the momentum score is above 65, also display: "APE IN SIGNAL 🚀" to indicate strong momentum.
  
  Example format for the rating:
  "Sentiment Score: 75/100
   Rating: BULLISH 🟢
   APE IN SIGNAL 🚀"
  
  Always remind users that all trading involves risk and decisions should be made carefully.`;

  const messages = [
    new HumanMessage({
      content: [
        {
          type: "text",
          text: message,
        },
      ],
    }),
  ];

  // Add chat history if available
  const allMessages = [...chatHistory, ...messages];

  try {
    const response = await model.invoke(allMessages, {
      system: systemPrompt,
    });

    return response.content;
  } catch (error) {
    console.error("Error in chat with agent:", error);
    return "I'm experiencing some technical difficulties. Please try again later.";
  }
};

// Direct Anthropic API integration for advanced features
export const directAnthropicChat = async (message: string, chatHistory: Array<{role: string, content: string}> = []) => {
  if (!anthropicApiKey) {
    throw new Error("Anthropic API key is not available");
  }
  
  try {
    // Format the messages according to Anthropic's API requirements
    const formattedMessages = chatHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add the new message
    formattedMessages.push({
      role: "user",
      content: message
    });
    
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-7-sonnet-20250219",
        messages: formattedMessages,
        max_tokens: 1024,
        temperature: 0.7,
        system: `You are TradesXBT, an AI trading agent specializing in Solana ecosystem tokens.
        You provide concise, accurate information about crypto trading, market analysis, and investment strategies.
        When discussing tokens or market trends, focus on facts and be transparent about uncertainty.
        Do not make guaranteed price predictions or returns.
        You ONLY provide analysis for Solana ecosystem tokens. For other tokens, politely explain that you specialize in Solana ecosystem analysis.
        
        IMPORTANT: After analyzing a token, always provide a sentiment score from 0-100 based on:
        - Recent price action
        - Volume trends in the 5min, 15min, and 30min timeframes
        - Market cap movement
        - Technical indicators
        
        Then display one of these ratings based on the score:
        - BEARISH 🔴 (score ≤ 35)
        - DYOR 🟡 (score 36-66)
        - BULLISH 🟢 (score ≥ 67)
        
        If the momentum score is above 65, also display: "APE IN SIGNAL 🚀" to indicate strong momentum.
        
        Example format for the rating:
        "Sentiment Score: 75/100
         Rating: BULLISH 🟢
         APE IN SIGNAL 🚀"
         
        Always remind users that all trading involves risk and decisions should be made carefully.`
      })
    });
    
    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      content: data.content[0].text,
      usage: data.usage
    };
  } catch (error) {
    console.error("Error in direct Anthropic chat:", error);
    throw error;
  }
};