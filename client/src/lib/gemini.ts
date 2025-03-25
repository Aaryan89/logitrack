import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with the API key from environment variables
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Function to get route optimization suggestions
export async function getRouteOptimization(
  currentLocation: string,
  deliveryLocations: string[],
  truckContents: string[]
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
    As a logistics route optimization AI, please analyze the following delivery scenario and suggest the most efficient route:
    
    Current Location: ${currentLocation}
    
    Delivery Locations:
    ${deliveryLocations.map((loc, i) => `${i + 1}. ${loc}`).join('\n')}
    
    Truck Contents:
    ${truckContents.map((item, i) => `${i + 1}. ${item}`).join('\n')}
    
    Please provide:
    1. The optimal delivery sequence to minimize total distance
    2. Estimated travel time between stops
    3. Suggested rest stops or refueling stations along the route
    4. Any traffic or weather conditions to be aware of (if applicable)
    
    Format the response in a clear, structured manner suitable for display to a truck driver.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating route optimization:", error);
    return "Unable to generate route optimization at this time. Please try again later.";
  }
}

// Function to analyze truck inventory and provide recommendations
export async function analyzeInventory(
  inventory: {name: string, quantity: number, expiryDate?: string}[]
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
    As an inventory management AI, please analyze the following truck inventory:
    
    ${inventory.map(item => 
      `- ${item.name}: ${item.quantity} units${item.expiryDate ? ` (Expires: ${item.expiryDate})` : ''}`
    ).join('\n')}
    
    Please provide:
    1. Items that should be prioritized for delivery based on expiry dates
    2. Suggestions for optimal storage arrangement in the truck
    3. Any items that may need special handling or conditions
    4. Any inventory discrepancies or potential issues to be aware of
    
    Format the response in a clear, structured manner suitable for display to a truck driver.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error analyzing inventory:", error);
    return "Unable to analyze inventory at this time. Please try again later.";
  }
}

// Function to suggest delivery deadlines based on inventory
export async function suggestDeadlines(
  inventory: {name: string, quantity: number, expiryDate?: string, destination?: string}[]
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
    As a logistics management AI, please analyze the following inventory items and suggest appropriate delivery deadlines:
    
    ${inventory.map(item => 
      `- ${item.name}: ${item.quantity} units${item.expiryDate ? ` (Expires: ${item.expiryDate})` : ''}${item.destination ? ` (Destination: ${item.destination})` : ''}`
    ).join('\n')}
    
    Please provide:
    1. Recommended delivery deadlines for each item, considering expiry dates and priority
    2. Items that should be expedited due to short shelf life
    3. Suggestions for batch deliveries to optimize logistics
    4. Any potential scheduling conflicts or challenges
    
    Format the response in a clear, structured manner suitable for inventory managers.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error suggesting deadlines:", error);
    return "Unable to suggest deadlines at this time. Please try again later.";
  }
}

// Function to categorize and analyze emails
export async function analyzeEmails(emails: {subject: string, content: string, sender: string, date: string}[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
    As an email management AI for a logistics company, please analyze the following emails:
    
    ${emails.map((email, i) => `
    Email ${i + 1}:
    - From: ${email.sender}
    - Date: ${email.date}
    - Subject: ${email.subject}
    - Content: ${email.content}
    `).join('\n')}
    
    Please categorize each email into one of the following groups:
    - Delivery Confirmations
    - Route Changes
    - Inventory Queries
    - Customer Issues
    - Urgent Action Required
    - Other
    
    For each email, provide:
    1. The appropriate category
    2. A brief summary of the content (max 15 words)
    3. Any suggested actions or responses
    4. Priority level (High, Medium, Low)
    
    Format the response in a structured manner suitable for display to logistics managers.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error analyzing emails:", error);
    return "Unable to analyze emails at this time. Please try again later.";
  }
}