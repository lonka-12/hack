import type { FinancialResources, CounselingServices } from '../types';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;

export const fetchTreatmentCosts = async (cancerType: string, stage: string): Promise<{ [treatment: string]: string }> => {
  if (!OPENAI_API_KEY) return {};

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a healthcare cost analyst. Provide current 2025 treatment cost estimates for ${cancerType} at ${stage}. Return ONLY a JSON object with treatment types as keys and cost ranges as values. Use actual current market rates. Format: {"surgery": "$X,XXX-XX,XXX", "chemotherapy": "$X,XXX-XX,XXX", etc.}`,
          },
          {
            role: "user",
            content: `What are the current average treatment costs for ${cancerType} at ${stage} in the United States in 2025? Include relevant treatments like surgery, chemotherapy, radiation, immunotherapy, targeted therapy, etc. as applicable.`,
          },
        ],
        max_tokens: 300,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;

    try {
      const costs = JSON.parse(content);
      return costs;
    } catch {
      return {};
    }
  } catch (error) {
    return {};
  }
};

// New function for Google Custom Search
const performGoogleSearch = async (query: string): Promise<Array<{title: string, link: string}>> => {
  if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
    console.warn('Google API key or CSE ID not configured');
    return [];
  }

  try {
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CSE_ID}&q=${encodeURIComponent(query)}&num=2`;
    
    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(`Google search failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return data.items.slice(0, 2).map((item: any) => ({
        title: item.title || 'Unknown Title',
        link: item.link || ''
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Google search error:', error);
    return [];
  }
};

// Fallback financial resources when Google search is not available
const getFallbackFinancialResources = (state: string): FinancialResources => {
  const federalResources = [
    {
      name: "American Cancer Society - Financial Aid",
      phone: "1-800-227-2345",
      website: "https://www.cancer.org/treatment/support-programs-and-services.html"
    },
    {
      name: "CancerCare - Financial Assistance",
      phone: "1-800-813-4673",
      website: "https://www.cancercare.org/financial"
    }
  ];

  const stateResources = [
    {
      name: `${state} Cancer Coalition`,
      phone: "Contact via website",
      website: `https://www.google.com/search?q=${encodeURIComponent(`${state} cancer financial assistance programs`)}`
    }
  ];

  return {
    federal: federalResources,
    state: stateResources
  };
};

export const fetchFinancialResources = async (state: string): Promise<FinancialResources> => {
  try {
    // Search for federal financial aid resources with more specific queries
    const federalQuery = `cancer financial assistance programs`;
    const federalResults = await performGoogleSearch(federalQuery);
    
    // Search for state-specific financial aid resources
    const stateQuery = `${state} cancer financial aid assistance programs`;
    const stateResults = await performGoogleSearch(stateQuery);
    
    // Convert search results to FinancialResource format
    const federalResources = federalResults.map(result => ({
      name: result.title,
      phone: "Contact via website",
      website: result.link
    }));
    
    const stateResources = stateResults.map(result => ({
      name: result.title,
      phone: "Contact via website", 
      website: result.link
    }));
    
    // If we got results from Google search, use them; otherwise use fallback
    if (federalResources.length > 0 || stateResources.length > 0) {
      return {
        federal: federalResources,
        state: stateResources
      };
    } else {
      // Use fallback resources when Google search returns no results
      return getFallbackFinancialResources(state);
    }
  } catch (error) {
    console.error('Error fetching financial resources:', error);
    // Return fallback resources on error
    return getFallbackFinancialResources(state);
  }
};

// Fallback counseling services when Google search is not available
const getFallbackCounselingServices = (state: string): CounselingServices => {
  const federalResources = [
    {
      name: "American Cancer Society - Support Programs",
      phone: "1-800-227-2345",
      website: "https://www.cancer.org/treatment/support-programs-and-services.html",
      type: "Emotional Support"
    },
    {
      name: "CancerCare - Counseling Services",
      phone: "1-800-813-4673",
      website: "https://www.cancercare.org/counseling",
      type: "Financial Counseling"
    },
    {
      name: "National Cancer Institute - Support Resources",
      phone: "1-800-422-6237",
      website: "https://www.cancer.gov/about-cancer/coping",
      type: "Emotional Support"
    }
  ];

  const stateResources = [
    {
      name: `${state} Cancer Support Network`,
      phone: "Contact via website",
      website: `https://www.google.com/search?q=${encodeURIComponent(`${state} cancer counseling support services`)}`,
      type: "Emotional Support"
    }
  ];

  return {
    federal: federalResources,
    state: stateResources
  };
};

export const fetchCounselingServices = async (state: string): Promise<CounselingServices> => {
  try {
    // Search for federal counseling and support services
    const federalQuery = `cancer counseling support services mental health`;
    const federalResults = await performGoogleSearch(federalQuery);
    
    // Search for state-specific counseling services
    const stateQuery = `${state} cancer counseling support services mental health`;
    const stateResults = await performGoogleSearch(stateQuery);
    
    // Convert search results to CounselingResource format
    const federalResources = federalResults.map(result => ({
      name: result.title,
      phone: "Contact via website",
      website: result.link,
      type: "Emotional Support" // Default type, could be enhanced with AI classification
    }));
    
    const stateResources = stateResults.map(result => ({
      name: result.title,
      phone: "Contact via website", 
      website: result.link,
      type: "Emotional Support" // Default type, could be enhanced with AI classification
    }));
    
    // If we got results from Google search, use them; otherwise use fallback
    if (federalResources.length > 0 || stateResources.length > 0) {
      return {
        federal: federalResources,
        state: stateResources
      };
    } else {
      // Use fallback resources when Google search returns no results
      return getFallbackCounselingServices(state);
    }
  } catch (error) {
    console.error('Error fetching counseling services:', error);
    // Return fallback resources on error
    return getFallbackCounselingServices(state);
  }
};

export const sendMessageToAI = async (message: string, formData: {
  selectedState: string;
  cancerType: string;
  stage: string;
  insuranceType: string;
}): Promise<string> => {
  if (!OPENAI_API_KEY) {
    return "The AI assistant requires an OpenAI API key to be configured in the code. Please add your API key to the designated section in the source code to enable this feature.";
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a compassionate healthcare assistant helping cancer patients understand treatment costs and find resources. 

            Current patient context: 
            - Location: ${formData.selectedState || "Not specified"}
            - Cancer type: ${formData.cancerType || "Not specified"}
            - Stage: ${formData.stage || "Not specified"}
            - Insurance: ${formData.insuranceType || "Not specified"}

            You can provide:
            - Current treatment cost estimates and ranges for 2025
            - State-specific financial aid programs and resources with current contact information
            - Insurance navigation advice
            - National cancer support organizations with up-to-date phone numbers
            - Treatment center recommendations
            - Financial planning guidance
            - Emotional support resources

            Be supportive, informative, concise and straight to the point, and help them navigate financial aspects of cancer care. Always encourage consulting with healthcare providers for medical decisions. Provide specific current phone numbers, websites, and program names when possible. Use only current, accurate information for 2025.`,
          },
          { role: "user", content: message },
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    return "I'm having trouble connecting right now. Please check your API key or try again later.";
  }
}; 
